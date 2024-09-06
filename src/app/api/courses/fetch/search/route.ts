import connectDB from "@/lib/connectDB";
import Course from "@/model/course.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	await connectDB(); // Connect to the database

	try {
		const url = new URL(req.url);
		const query = url.searchParams.get("query") || ""; // Search query
		const category = url.searchParams.get("category"); // Filter by category
		const level = url.searchParams.get("level"); // Filter by course level
		const language = url.searchParams.get("language"); // Filter by language
		const minRating = parseFloat(url.searchParams.get("minRating") || "0"); // Filter by minimum rating
		const maxPrice = parseFloat(url.searchParams.get("maxPrice") || "Infinity"); // Filter by maximum price
		const sort = url.searchParams.get("sort") || "relevance"; // Sorting option

		let filter: any = {};

		// Text search filter
		if (query) {
			filter.$text = { $search: query };
		}

		// Category filter
		if (category) {
			filter.category = category;
		}

		// Level filter
		if (level) {
			filter.level = level;
		}

		// Language filter
		if (language) {
			filter.language = language;
		}

		// Minimum rating filter
		if (minRating) {
			filter.averageRating = { $gte: minRating };
		}

		// Maximum price filter
		if (maxPrice !== Infinity) {
			filter.price = { $lte: maxPrice };
		}

		// Sorting options
		let sortOption: any = {};
		if (sort === "relevance") {
			sortOption = { score: { $meta: "textScore" } };
		} else if (sort === "rating") {
			sortOption = { averageRating: -1 };
		} else if (sort === "price") {
			sortOption = { price: 1 };
		} else if (sort === "enrollment") {
			sortOption = { enrollmentCount: -1 };
		}

		// Fetch filtered and sorted courses
		const courses = await Course.find(filter)
			.sort(sortOption)
			.select(
				"title description thumbnailUrl category price language averageRating enrollmentCount"
			);

		return NextResponse.json(
			{ message: "Courses fetched successfully", success: true, courses },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error fetching courses:", error);
		return NextResponse.json(
			{ message: "Error fetching courses", success: false },
			{ status: 500 }
		);
	}
}
