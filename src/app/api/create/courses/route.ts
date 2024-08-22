import getUserByClerkId from "@/app/utils/getMongoUserId";
import connectDB from "@/lib/connectDB";
import Course from "@/model/course.model";
import User from "@/model/user.model";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const { userId } = await getAuth(request);
		const currentUser = await getUserByClerkId(userId!);

		const { title, description, category, language, price, level } =
			await request.json();

		// Validate required fields
		if (
			!title ||
			!description ||
			!category ||
			!level ||
			!language ||
			price === undefined
		) {
			return NextResponse.json(
				{ error: "Missing required fields", success: false },
				{ status: 400 }
			);
		}

		await connectDB();

		const newCourse = new Course({
			title,
			description,
			category,
			level,
			language,
			price,
			duration: 0,
			creatorId: currentUser?._id, // Replace with actual tutor ID from authentication
		});

		await newCourse.save();

		// Update the current user (creator) by pushing the course ID to the createdCourses field
		await User.findByIdAndUpdate(
			currentUser?._id,
			{ $push: { createdCourses: newCourse._id } },
			{ new: true }
		);

		return NextResponse.json(
			{
				message: "Course created successfully",
				course: newCourse,
				success: true,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating course:", error);
		return NextResponse.json(
			{ error: "Failed to create course", success: false },
			{ status: 500 }
		);
	}
}
