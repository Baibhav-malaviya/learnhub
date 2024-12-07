import { NextRequest, NextResponse } from "next/server";
import { auth, getAuth } from "@clerk/nextjs/server";
import connectDB from "@/lib/connectDB";
import User from "@/model/user.model";
import Course from "@/model/course.model";
import mongoose from "mongoose";
import { enrollUserInCourse } from "@/lib/routeFunction";

export async function POST(req: NextRequest) {
	try {
		await connectDB();

		// Get the authenticated user
		const { userId } = await getAuth(req);
		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Parse request body
		const { courseId } = await req.json();
		if (!courseId) {
			return NextResponse.json(
				{ error: "Course ID is required" },
				{ status: 400 }
			);
		}

		const user = await User.findOne({ clerkUserId: userId });

		if (!user)
			return NextResponse.json({ success: false, message: "User not found" });
		// Enroll the user
		const result = await enrollUserInCourse(user._id, courseId);

		if (!result.success) {
			return NextResponse.json({ message: result.message }, { status: 400 });
		}

		return NextResponse.json(
			{
				message: result.message,
				enrolledCourseId: result.enrolledCourseId,
			},
			{ status: 200 }
		);
	} catch (error: any) {
		console.error("Error enrolling student:", error.message);
		return NextResponse.json(
			{ error: "Internal Server Error", details: error.message },
			{ status: 500 }
		);
	}
}
