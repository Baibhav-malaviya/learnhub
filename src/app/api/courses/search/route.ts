import { NextRequest, NextResponse } from "next/server";
import { FilterQuery } from "mongoose";
import connectDB from "@/lib/connectDB";
import Course, { ICourse } from "@/model/course.model";

interface SearchParams {
	query?: string;
}

export async function GET(req: NextRequest) {
	const { query }: SearchParams = Object.fromEntries(
		new URL(req.url).searchParams.entries()
	);

	console.log("query: ", query);
	const filter: FilterQuery<ICourse> = {};

	if (query) {
		filter.$or = [
			{ title: { $regex: query, $options: "i" } },
			{ description: { $regex: query, $options: "i" } },
			{ category: { $regex: query, $options: "i" } },
		];
	}

	try {
		await connectDB();

		const courses = await Course.find(filter)
			.populate({
				path: "tutorId",
				select: "name",
				match: query ? { name: { $regex: query, $options: "i" } } : {},
			})
			.sort({ enrollmentCount: -1 })
			.exec();

		const filteredCourses = courses.filter((course) => course.creatorId);

		return NextResponse.json(
			{
				courses: { filteredCourses, courses },
				message: "Courses fetched successfully",
				success: true,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error fetching courses:", error);
		return NextResponse.json(
			{ message: `Error fetching courses: ${error}`, success: false },
			{ status: 500 }
		);
	}
}
