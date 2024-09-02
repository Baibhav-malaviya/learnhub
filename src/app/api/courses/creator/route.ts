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
		const creatorCourses = await Course.find({ creatorId: currentUser._id });

		return NextResponse.json(
			{
				courses: creatorCourses,
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
