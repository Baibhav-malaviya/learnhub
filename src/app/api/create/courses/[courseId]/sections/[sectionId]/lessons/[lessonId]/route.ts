import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Course, { ICourse, ILesson } from "@/model/course.model";
import connectDB from "@/lib/connectDB";

export async function PUT(
	request: NextRequest,
	{
		params,
	}: { params: { courseId: string; sectionId: string; lessonId: string } }
) {
	try {
		const { courseId, sectionId, lessonId } = params;
		const updateData: Partial<ILesson> = await request.json();

		await connectDB();

		if (
			!mongoose.Types.ObjectId.isValid(courseId) ||
			!mongoose.Types.ObjectId.isValid(sectionId) ||
			!mongoose.Types.ObjectId.isValid(lessonId)
		) {
			return NextResponse.json(
				{ error: "Invalid course ID, section ID, or lesson ID" },
				{ status: 400 }
			);
		}

		const course = (await Course.findOneAndUpdate(
			{
				_id: courseId,
				"sections._id": sectionId,
				"sections.lessons._id": lessonId,
			},
			{
				$set: Object.fromEntries(
					Object.entries(updateData).map(([key, value]) => [
						`sections.$[sectionIndex].lessons.$[lessonIndex].${key}`,
						value,
					])
				),
			},
			{
				arrayFilters: [
					{ "sectionIndex._id": sectionId },
					{ "lessonIndex._id": lessonId },
				],
				new: true,
			}
		)) as ICourse | null;

		if (!course) {
			return NextResponse.json(
				{ error: "Course, section, or lesson not found" },
				{ status: 404 }
			);
		}

		const updatedLesson = course.sections
			.find((section) => section._id.toString() === sectionId)
			?.lessons.find((lesson) => lesson._id.toString() === lessonId);

		return NextResponse.json({
			message: "Lesson updated successfully",
			lesson: updatedLesson,
		});
	} catch (error) {
		console.error("Error updating lesson:", error);
		return NextResponse.json(
			{ error: "Failed to update lesson" },
			{ status: 500 }
		);
	}
}
