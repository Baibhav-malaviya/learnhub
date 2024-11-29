import { NextRequest, NextResponse } from "next/server";
import Gift from "@/model/gift.model";
import connectDB from "@/lib/connectDB";
import enrollUserInCourse from "@/lib/helpers/enrollUserInCourse"; // Helper function for enrollment
import { getAuth } from "@clerk/nextjs/server";
import User from "@/model/user.model";
import Course from "@/model/course.model";

export async function POST(req: NextRequest) {
	try {
		await connectDB();
		const { qrCodeData } = await req.json();
		const { userId: clerkUserId } = getAuth(req);

		const user = await User.findOne({ clerkUserId });

		if (!user)
			return NextResponse.json({
				message: "user not found | UnAuthorized",
				success: false,
			});

		const gift = await Gift.findOne({ qrCodeData, isActive: true });

		if (!gift || gift.remainingCopies <= 0) {
			return NextResponse.json({
				message: "This gift has already been redeemed  or is invalid.",
				success: false,
			});
		}

		// Decrement remaining copies
		gift.remainingCopies -= 1;

		// If no copies left, deactivate the gift
		if (gift.remainingCopies === 0) {
			gift.isActive = false;
		}

		await gift.save();

		// Find the course
		const course = await Course.findById(gift.courseId);

		if (!course)
			return NextResponse.json({
				message: "This course is no longer exist",
				success: false,
			});

		// Check if the user is already enrolled
		if (course.enrolledStudent.includes(user._id))
			return NextResponse.json({
				message: "User is already enrolled in this course.",
				success: false,
			});

		// Enroll the user
		course.enrolledStudent.push(user._id);
		course.enrollmentCount += 1; // Increment enrollment count

		await course.save();

		// Optionally, update the user's enrolled courses
		user.enrolledCourses.push(gift.courseId);

		await user.save();

		return NextResponse.json({
			message: "Gift redeemed successfully!",
			success: true,
		});
	} catch (error) {
		return NextResponse.json(
			{ error: (error as any).message },
			{ status: 500 }
		);
	}
}
