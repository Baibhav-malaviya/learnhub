import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Course, { ICourse, ILesson } from "@/model/course.model";
import connectDB from "@/lib/connectDB";

export async function POST(
	request: Request,
	{ params }: { params: { courseId: string; sectionId: string } }
) {
	try {
		const { courseId, sectionId } = params;
		const lessonData: Omit<ILesson, "_id"> = await request.json();

		await connectDB();

		if (
			!mongoose.Types.ObjectId.isValid(courseId) ||
			!mongoose.Types.ObjectId.isValid(sectionId)
		) {
			return NextResponse.json(
				{ error: "Invalid course ID or section ID" },
				{ status: 400 }
			);
		}

		const newLesson: ILesson = {
			_id: new mongoose.Types.ObjectId(), // Automatically generate a new ObjectId
			...lessonData,
		};

		const course = (await Course.findOneAndUpdate(
			{ _id: courseId, "sections._id": sectionId },
			{ $push: { "sections.$.lessons": newLesson } },
			{ new: true }
		)) as ICourse | null;

		if (!course) {
			return NextResponse.json(
				{ error: "Course or section not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ message: "Lesson added successfully", lesson: newLesson },
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error adding lesson:", error);
		return NextResponse.json(
			{ error: "Failed to add lesson" },
			{ status: 500 }
		);
	}
}
