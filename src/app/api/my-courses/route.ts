import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Course from "@/model/course.model";
import { getAuth } from "@clerk/nextjs/server";
import getUserByClerkId from "@/app/utils/getMongoUserId";

export async function GET(req: NextRequest) {
	try {
		await connectDB();

		// Get Clerk User
		const { userId } = getAuth(req);

		if (!userId) {
			return NextResponse.json(
				{ message: "Unauthorized: User does not exist", success: false },
				{ status: 401 }
			);
		}

		// Fetch MongoDB User using Clerk ID
		const user = await getUserByClerkId(userId);

		if (!user) {
			return NextResponse.json(
				{ message: "User not found in the database", success: false },
				{ status: 404 }
			);
		}

		// Fetch courses where the user is enrolled
		const courses = await Course.find({ enrolledStudent: user._id });

		return NextResponse.json({ courses, success: true });
	} catch (error: any) {
		console.error("Error fetching courses:", error.message);
		return NextResponse.json(
			{ message: "Server error occurred", success: false },
			{ status: 500 }
		);
	}
}
