import connectDB from "@/lib/connectDB";
import Course from "@/model/course.model";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
	request: NextRequest,
	{ params }: { params: { courseId: string } }
) {
	try {
		const { courseId } = params;
		const updateData = await request.json();

		await connectDB();

		const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, {
			new: true,
		});

		if (!updatedCourse) {
			return NextResponse.json({ error: "Course not found" }, { status: 404 });
		}

		return NextResponse.json({
			message: "Course updated successfully",
			course: updatedCourse,
		});
	} catch (error) {
		console.error("Error updating course:", error);
		return NextResponse.json(
			{ error: "Failed to update course" },
			{ status: 500 }
		);
	}
}
