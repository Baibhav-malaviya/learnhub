// File: /app/api/courses/[id]/route.ts

import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Course from "@/model/course.model";
import User from "@/model/user.model";
import { Types } from "mongoose";

export async function GET(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		// Connect to the database
		await connectDB();

		const { id } = params;

		// Validate the course ID
		if (!Types.ObjectId.isValid(id)) {
			return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
		}

		// Find the course by ID and populate the creator details (creatorId)
		const course = await Course.findById(id).populate({
			path: "creatorId",
			model: User,
			select: "name email profileImage bio socialMediaLinks",
		});

		// If the course is not found, return a 404 error
		if (!course) {
			return NextResponse.json({ error: "Course not found" }, { status: 404 });
		}

		// Transform the response to replace creatorId with creator
		const transformedCourse = {
			...course.toObject(),
			creator: course.creatorId, // Assign creatorId to a new field 'creator'
		};

		delete (transformedCourse as any).creatorId; // Remove the original creatorId field

		// Return the transformed course details along with the populated creator details
		return NextResponse.json({ course: transformedCourse }, { status: 200 });
	} catch (error) {
		console.error("Error fetching course details:", error);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
