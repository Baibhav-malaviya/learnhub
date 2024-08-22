import redis from "@/lib/redis";
import connectDB from "@/lib/connectDB";
import Course from "@/model/course.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	await connectDB();
	try {
		const url = new URL(req.url);

		// Parse query parameters with validation
		const query = url.searchParams.get("query") || "";
		const limitParam = url.searchParams.get("limit") || "10";

		// Validate and constrain limit
		const limit = Math.min(Math.max(1, parseInt(limitParam, 10)), 50);

		// Prepare caching key
		const cacheKey = `courses_search_${query}_${limit}`;

		// Check Redis cache
		const cachedCourses = await redis.get(cacheKey);
		if (cachedCourses) {
			return NextResponse.json({
				message: "Courses fetched successfully (from cache)",
				success: true,
				courses: JSON.parse(cachedCourses),
			});
		}

		// Prepare filter for text search
		const filter = query ? { $text: { $search: query } } : {};

		// Fetch courses
		const courses = await Course.find(filter)
			.sort({
				// Prioritize courses with more enrollments and higher ratings
				enrollmentCount: -1,
				averageRating: -1,
			})
			.limit(limit)
			.select(
				"title description thumbnailUrl category price " +
					"language averageRating enrollmentCount level"
			);

		// Cache the results
		await redis.set(
			cacheKey,
			JSON.stringify(courses),
			"EX",
			3600 // 1 hour cache
		);

		return NextResponse.json(
			{
				message: "Courses fetched successfully",
				success: true,
				courses,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error fetching courses:", error);
		return NextResponse.json(
			{
				message: "Error fetching courses",
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
