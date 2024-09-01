import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/connectDB";
import Course, { ICourse } from "@/model/course.model";

export async function POST(
	request: Request,
	{ params }: { params: { courseId: string } }
) {
	try {
		const { courseId } = params;
		const { title } = await request.json();

		await connectDB();

		// Ensure courseId is a valid ObjectId
		if (!mongoose.Types.ObjectId.isValid(courseId)) {
			return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
		}

		const course = (await Course.findById(courseId)) as ICourse | null;

		if (!course) {
			return NextResponse.json({ error: "Course not found" }, { status: 404 });
		}

		const newSection = {
			_id: new mongoose.Types.ObjectId(),
			title,
			lessons: [],
		};

		// Use type assertion to inform TypeScript that sections exists
		(course.sections as any).push(newSection);

		await course.save();

		return NextResponse.json(
			{ message: "Section added successfully", section: newSection },
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error adding section:", error);
		return NextResponse.json(
			{ error: "Failed to add section" },
			{ status: 500 }
		);
	}
}
