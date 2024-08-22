import { NextResponse } from "next/server";

import mongoose from "mongoose";
import connectDB from "@/lib/connectDB";
import Course, { ICourse } from "@/model/course.model";

export async function PUT(
	request: Request,
	{ params }: { params: { courseId: string; sectionId: string } }
) {
	try {
		const { courseId, sectionId } = params;
		const { title } = await request.json();

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

		const course = (await Course.findOneAndUpdate(
			{ _id: courseId, "sections._id": sectionId },
			{ $set: { "sections.$.title": title } },
			{ new: true }
		)) as ICourse | null;

		if (!course) {
			return NextResponse.json(
				{ error: "Course or section not found" },
				{ status: 404 }
			);
		}

		const updatedSection = course.sections.find(
			(section) => section?._id.toString() === sectionId
		);

		return NextResponse.json({
			message: "Section updated successfully",
			section: updatedSection,
		});
	} catch (error) {
		console.error("Error updating section:", error);
		return NextResponse.json(
			{ error: "Failed to update section" },
			{ status: 500 }
		);
	}
}
