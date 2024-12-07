import Course from "@/model/course.model";
import User from "@/model/user.model";
import mongoose from "mongoose";

export async function enrollUserInCourse(
	userId: mongoose.Types.ObjectId, // this is clerk user id
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
		const user = await User.findOne({ clerkUserId: userId });
		if (!user) {
			return {
				success: false,
				message: "User not found",
			};
		}

		// Enroll the user
		user.enrolledCourses.push(courseId);
		course.enrollmentCount += 1;
		course.enrolledStudent.push(user._id);

		await user.save();
		await course.save();

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
