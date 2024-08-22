import { NextRequest, NextResponse } from "next/server";
import { auth, getAuth } from "@clerk/nextjs/server";
import connectDB from "@/lib/connectDB";
import User from "@/model/user.model";
import Course from "@/model/course.model";

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

		// Fetch course
		const course = await Course.findById(courseId);
		if (!course) {
			return NextResponse.json({ error: "Course not found" }, { status: 404 });
		}

		// Fetch user
		const user = await User.findOne({ clerkUserId: userId });
		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// Check if the user is already enrolled
		if (user.enrolledCourses.includes(courseId)) {
			return NextResponse.json(
				{ error: "Already enrolled in this course" },
				{ status: 400 }
			);
		}

		// Enroll the user
		user.enrolledCourses.push(courseId);
		course.enrollmentCount += 1;
		course.enrolledStudent.push(user._id);
		await user.save();
		await course.save();

		return NextResponse.json(
			{ message: "Enrollment successful", enrolledCourseId: courseId },
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
