import Course from "@/model/course.model";
import User from "@/model/user.model";
import mongoose from "mongoose";

/**
 * Enroll a user in a course.
 * @param userId - The MongoDB ObjectId of the user.
 * @param courseId - The MongoDB ObjectId of the course.
 * @throws Will throw an error if the course or user is not found.
 */
async function enrollUserInCourse(
	userId: mongoose.Types.ObjectId,
	courseId: mongoose.Types.ObjectId
) {
	try {
		// Find the course
		const course = await Course.findById(courseId);

		if (!course) {
			throw new Error("Course not found.");
		}

		// Check if the user is already enrolled
		if (course.enrolledStudent.includes(userId)) {
			throw new Error("User is already enrolled in this course.");
		}

		// Enroll the user
		course.enrolledStudent.push(userId);
		course.enrollmentCount += 1; // Increment enrollment count

		await course.save();

		// Optionally, update the user's enrolled courses
		await User.findByIdAndUpdate(userId, {
			$addToSet: { enrolledCourses: courseId },
		});
	} catch (error: any) {
		console.log(
			"Error in course enrollment through gift qrCode: ",
			error.message
		);
	}
}

export default enrollUserInCourse;
