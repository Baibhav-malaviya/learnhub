import connectDB from "@/lib/connectDB";
import Course from "@/model/course.model";
import { getAuth } from "@clerk/nextjs/server";
import getUserByClerkId from "@/app/utils/getMongoUserId";
import { NextRequest, NextResponse } from "next/server";
import User from "@/model/user.model";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const courseId = searchParams.get("courseId");

		const { userId } = await getAuth(request);

		if (!userId) {
			return NextResponse.json(
				{ enrolled: false, success: false },
				{ status: 401 }
			);
		}

		// Find the user in the database using clerkUserId
		const user = await User.findOne({ clerkUserId: userId });

		if (!user) {
			return NextResponse.json(
				{ enrolled: false, success: false, error: "User not found" },
				{ status: 404 }
			);
		}

		// Check if the user is already enrolled in the course
		const isEnrolled = await Course.exists({
			_id: courseId,
			enrolledStudent: user._id,
		});

		return NextResponse.json(
			{ enrolled: Boolean(isEnrolled), success: true },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error checking enrollment status:", error);
		return NextResponse.json(
			{ error: "Failed to check enrollment status", success: false },
			{ status: 500 }
		);
	}
}
