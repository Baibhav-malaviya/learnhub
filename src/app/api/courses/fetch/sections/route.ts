import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB"; // Adjust the path as needed
import Course from "@/model/course.model"; // Adjust the path as needed

import { ICourse } from "@/model/course.model";
import redis from "@/lib/redis";

export async function GET(request: NextRequest) {
	try {
		const url = new URL(request.url);

		const courseId = url.searchParams.get("courseId"); // Extract courseId from query parameters

		if (!courseId) {
			return NextResponse.json(
				{ message: "Course ID is required", success: false },
				{ status: 400 }
			);
		}

		// Connect to the database
		await connectDB();

		const cacheKey = `sections_${courseId}`;
		const cachedSections = await redis.get(cacheKey);

		if (cachedSections) {
			return NextResponse.json(
				{
					sections: JSON.parse(cachedSections),
					success: true,
					message: "Section fetched successfully (from cache)",
				},
				{ status: 200 }
			);
		}

		// Fetch the course by ID and get sections
		const course = (await Course.findById(courseId)
			.select("sections")
			.exec()) as ICourse;

		if (!course) {
			return NextResponse.json(
				{ message: "Course not found", success: false },
				{ status: 404 }
			);
		}

		await redis.set(cacheKey, JSON.stringify(course.sections), "EX", 3600);

		// Return the sections of the course
		return NextResponse.json(
			{
				sections: course.sections,
				success: true,
				message: "Section fetched successfully",
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error fetching sections:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}
