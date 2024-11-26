import redis from "@/lib/redis";
import connectDB from "@/lib/connectDB";
import Course from "@/model/course.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	await connectDB(); // Connect to the database

	try {
		const url = new URL(req.url);
		const query = url.searchParams.get("query");
		const limit = url.searchParams.get("limit");

		// Check if the result is already cached in Redis

		const cacheKey = `courses_${query}_${limit}`;
		const cachedCourses = await redis.get(cacheKey);

		if (cachedCourses) {
			return NextResponse.json({
				message: "courses fetched successfully (from cache)",
				success: true,
				courses: JSON.parse(cachedCourses),
			});
		}

		// Default limit to 10 if not provided
		const coursesLimit = limit
			? Math.min(Math.max(parseInt(limit, 10), 1), 50)
			: 10; // Ensure between 1-50 courses

		// Base query for fetching popular courses
		let filter = {};

		// If query is provided, perform a text search
		if (query) {
			filter = {
				$text: { $search: query as string },
			};
		}

		// Find popular courses based on enrollmentCount or rating
		const courses = await Course.find(filter)
			.sort({ enrollmentCount: -1, averageRating: -1 }) // Sort by popularity
			.limit(coursesLimit) // Limit results
			.select(
				"title description thumbnailUrl category price language averageRating enrollmentCount"
			); // Select necessary fields

		// Store the fetched courses in Redis cache with an expiration time
		await redis.set(cacheKey, JSON.stringify(courses), "EX", 3600); // Cache for 1 hour

		return NextResponse.json(
			{ message: "courses fetched successfully", success: true, courses },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error fetching popular courses:", error);
		return NextResponse.json(
			{ message: "Error fetching popular courses", success: false },
			{ status: 500 }
		);
	}
}
