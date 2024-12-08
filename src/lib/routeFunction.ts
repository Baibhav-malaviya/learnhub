import Course from "@/model/course.model";
import User from "@/model/user.model";
import mongoose from "mongoose";

export async function enrollUserInCourse(
	userId: mongoose.Types.ObjectId, // clerk user id
	courseId: mongoose.Types.ObjectId
) {
	try {
		// Fetch course
		const course = await Course.findById(courseId);
		if (!course) {
			return {
				success: false,
				message: "Course not found",
			};
		}

		// Fetch user
		const user = await User.findById(userId);
		if (!user) {
			return {
				success: false,
				message: "User not found routeFunction",
			};
		}

		// Check if already enrolled (prevents duplicate enrollment)
		const isAlreadyEnrolled = user.enrolledCourses.some(
			(enrolledCourse) => enrolledCourse.toString() === courseId.toString()
		);

		if (isAlreadyEnrolled) {
			return {
				success: false,
				message: "Already enrolled in this course",
			};
		}

		// Enroll the user
		user.enrolledCourses.push(courseId);
		course.enrollmentCount += 1;
		course.enrolledStudent.push(user._id);

		// Consider using a transaction for atomic updates
		const session = await mongoose.startSession();
		try {
			await session.withTransaction(async () => {
				await user.save({ session });
				await course.save({ session });
			});
		} finally {
			session.endSession();
		}

		return {
			success: true,
			message: "Enrollment successful",
			enrolledCourseId: courseId,
		};
	} catch (error: any) {
		console.error("Enrollment error:", error);
		return {
			success: false,
			message: error.message || "Enrollment failed",
		};
	}
}
