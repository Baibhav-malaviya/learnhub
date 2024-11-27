import getUserByClerkId from "@/app/utils/getMongoUserId";
import connectDB from "@/lib/connectDB";
import Course from "@/model/course.model";
import { getAuth } from "@clerk/nextjs/server";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const { userId } = await getAuth(req);
	const currentUser = await getUserByClerkId(userId!);
	try {
		await connectDB();
		if (!currentUser)
			return NextResponse.json(
				{
					message: "unable to find the current user",
					success: false,
				},
				{ status: 400 }
			);

		// Find courses created by the specified creator
		// const courses = await Course.find({ creatorId: currentUser._id });

		const courses = await Course.find({ creatorId: currentUser._id })
			.populate({
				path: "creatorId", // Populates creator details from the User model
				select: "_id clerkUserId email name profileImage", // Selects specific fields to include
			})
			.lean(); // Converts Mongoose documents to plain JavaScript objects

		// Transform the response
		const formattedCourses = courses.map((course) => ({
			...course, // Spread the original course object
			creator: course.creatorId, // Add a separate `creator` field with the populated details
		}));

		return NextResponse.json(
			{
				courses: formattedCourses,
				message: "Courses fetched successfully",
				success: true,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error fetching creator courses:", error);
		return NextResponse.json(
			{ message: "Internal Server Error", success: false },
			{ status: 500 }
		);
	}
}
