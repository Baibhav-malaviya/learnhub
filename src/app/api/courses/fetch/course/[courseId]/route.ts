// File: /app/api/courses/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Course from "@/model/course.model";
import User from "@/model/user.model";
import { Types } from "mongoose";
import getUserByClerkId from "@/app/utils/getMongoUserId";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(
	req: NextRequest,
	{ params }: { params: { courseId: Types.ObjectId } }
) {
	try {
		// Connect to the database
		await connectDB();

		const { courseId } = params;

		const { userId } = await getAuth(req);

		// If no user ID is found, return a 401 Unauthorized error
		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Validate the course ID
		if (!Types.ObjectId.isValid(courseId)) {
			return NextResponse.json(
				{ error: "invalid Id course ID" },
				{ status: 400 }
			);
		}

		// Find the course by ID and populate the creator details and sections with lessons
		const course = await Course.findById(courseId)
			.populate({
				path: "creatorId",
				model: User,
				select: "clerkUserId name email profileImage bio socialMediaLinks",
			})
			.populate({
				path: "sections.lessons",
				select: "title content videoUrl duration preview", // Select necessary fields
			});

		console.log("course by id: ", course);

		// If the course is not found, return a 404 error
		if (!course) {
			return NextResponse.json({ error: "Course not found" }, { status: 404 });
		}

		// Find the user in the database using clerkUserId
		const user = await User.findOne({ clerkUserId: userId });

		// If the user is not found, return a 404 error
		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// Check if the user is enrolled in the course
		const isEnrolled = user.enrolledCourses.includes(courseId);

		// Transform the lessons based on enrollment status
		const transformedSections = course.sections.map((section) => {
			const transformedLessons = section.lessons.map((lesson) => ({
				_id: lesson._id,
				title: lesson.title,
				preview: lesson.preview, // Indicates if the lesson is a preview
				content: lesson.preview || isEnrolled ? lesson.content : null, // Only show content if preview or enrolled
				videoUrl: lesson.preview || isEnrolled ? lesson.videoUrl : null,
				duration: lesson.duration,
			}));

			return {
				...section.toObject(),
				lessons: transformedLessons,
			};
		});

		// Transform the response to replace creatorId with creator
		const transformedCourse = {
			...course.toObject(),
			creator: course.creatorId, // Assign creatorId to a new field 'creator'
			sections: transformedSections, // Include the transformed sections with lessons
		};

		delete (transformedCourse as any).creatorId; // Remove the original creatorId field

		// Return the transformed course details along with the populated creator details and controlled lessons
		return NextResponse.json(
			{ course: transformedCourse, isEnrolled },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error fetching course details:", error);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
