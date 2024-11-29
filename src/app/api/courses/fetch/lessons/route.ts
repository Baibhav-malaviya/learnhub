import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/connectDB";
import Course from "@/model/course.model";
import redis from "@/lib/redis";

//  * GET handler for fetching lessons of a specific section in a course

export async function GET(request: NextRequest): Promise<NextResponse> {
	// Extract courseId and sectionId from the URL query parameters
	const url = new URL(request.url);
	const courseId = url.searchParams.get("courseId");
	const sectionId = url.searchParams.get("sectionId");

	// Validate the presence of required parameters
	if (!courseId || !sectionId) {
		return NextResponse.json(
			{ success: false, error: "Missing courseId or sectionId" },
			{ status: 400 }
		);
	}

	try {
		// Connect to the database
		await connectDB();

		const cacheKey = `lessons_${courseId}_${sectionId}`;
		const cachedLessons = await redis.get(cacheKey);

		// if (cachedLessons) {
		// 	return NextResponse.json({
		// 		message: "Lessons fetched successfully (from cache)",
		// 		success: true,
		// 		lessons: JSON.parse(cachedLessons),
		// 	});
		// }

		// Validate and convert IDs to ObjectId
		const courseObjectId = mongoose.Types.ObjectId.isValid(courseId)
			? new mongoose.Types.ObjectId(courseId)
			: null;
		const sectionObjectId = mongoose.Types.ObjectId.isValid(sectionId)
			? new mongoose.Types.ObjectId(sectionId)
			: null;

		if (!courseObjectId || !sectionObjectId) {
			return NextResponse.json(
				{ success: false, error: "Invalid courseId or sectionId format" },
				{ status: 400 }
			);
		}

		// Fetch the course and specific section
		const course = await Course.findOne(
			{
				_id: courseObjectId,
				"sections._id": sectionObjectId,
			},
			{ "sections.$": 1 }
		).lean();

		// Check if the course and section exist
		if (!course || !course.sections || course.sections.length === 0) {
			return NextResponse.json(
				{ success: false, error: "Course or section not found" },
				{ status: 404 }
			);
		}

		// Extract lessons from the section
		const lessons = course.sections[0].lessons;

		await redis.set(cacheKey, JSON.stringify(lessons), "EX", 3600);

		// Return the lessons
		return NextResponse.json({
			message: "Lessons fetched successfully",
			success: true,
			lessons,
		});
	} catch (error) {
		console.error("Error fetching lessons:", error);
		return NextResponse.json(
			{ success: false, message: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
