import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB"; // Adjust the path as needed
import Course from "@/model/course.model"; // Adjust the path as needed

import { ICourse } from "@/model/course.model";

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
