import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import User from "@/model/user.model";
import Course from "@/model/course.model";

export async function GET(
	request: Request,
	{ params }: { params: { creatorId: string } }
) {
	await connectDB();

	const { creatorId } = params;

	try {
		// Fetch the creator details
		const creator = await User.findById(creatorId).select(
			"name bio email profileImage socialMediaLinks"
		);

		if (!creator) {
			return NextResponse.json(
				{ message: "Creator not found" },
				{ status: 404 }
			);
		}

		// Fetch courses created by the creator
		const courses = await Course.find({ creatorId }).exec();

		// Calculate total courses created by the creator
		const totalCoursesCreated = courses.length;

		// Calculate total students enrolled (summing enrollmentCount from each course)
		const totalStudentsEnrolled = courses.reduce(
			(sum, course) => sum + (course.enrollmentCount || 0),
			0
		);

		// Calculate total video content hours (sum of durations of all lessons in all courses)
		const totalVideoContentMins = courses.reduce((sum, course) => {
			return (
				sum +
				course.sections.reduce((secSum, section) => {
					return (
						secSum +
						section.lessons.reduce((lessonSum, lesson) => {
							return lesson.duration ? lessonSum + lesson.duration : lessonSum;
						}, 0)
					);
				}, 0)
			);
		}, 0);

		return NextResponse.json({
			message: "Creator data fetched successfully",
			creator: {
				...creator.toObject(),
				totalCoursesCreated,
				totalStudentsEnrolled,
				totalVideoContentMins, // In hours (you can convert from minutes if needed)
			},
			courses,
		});
	} catch (error) {
		console.error("Error fetching creator details:", error);
		return NextResponse.json(
			{ error: "Something went wrong" },
			{ status: 500 }
		);
	}
}
