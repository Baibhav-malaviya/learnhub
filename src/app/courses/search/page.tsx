"use client";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import CourseCard from "@/app/create/components/CourseCard";
import SearchInput from "@/components/SearchInput";
import Section from "@/components/myComponents/Section";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component in your project
import { formatNumberWithCommas } from "@/utils/commonFunc";
import { ICourse } from "@/model/course.model";

function SearchCourse() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const query = searchParams.get("query");
	const category = searchParams.get("category") || "all-categories";
	const level = searchParams.get("level") || "all-levels";
	const sort = searchParams.get("sort") || "relevance";
	const minRating = searchParams.get("minRating") || "0";
	const maxPrice = searchParams.get("maxPrice") || "";

	const [courses, setCourses] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	// Fetch courses based on query and filters
	useEffect(() => {
		const fetchCourses = async () => {
			try {
				// Build the filters object
				const filters = {
					category: category !== "all-categories" ? category : null,
					level: level !== "all-levels" ? level : null,
					minRating: minRating !== "0" ? minRating : null,
					maxPrice: maxPrice || null, // Keep maxPrice as it is
					sort: sort || "relevance", // Keep sort as it is
				};

				// Create query string by excluding null filters
				const queryString = Object.entries(filters)
					.filter(([key, value]) => value !== null)
					.map(([key, value]) => `${key}=${value}`)
					.join("&");

				// Make API call with the final query string
				const response = await axios.get(
					`/api/courses/fetch/search?query=${query}&${queryString}`
				);

				setCourses(response.data.courses);
			} catch (error) {
				console.error("Error fetching search results:", error);
			} finally {
				setIsLoading(false);
			}
		};

		if (query) {
			fetchCourses();
		}
	}, [query, category, level, minRating, maxPrice, sort]);

	// Handle filter change
	const handleFilterChange = (newFilters: any) => {
		const newSearchParams = new URLSearchParams(searchParams);
		Object.keys(newFilters).forEach((key) => {
			newSearchParams.set(key, newFilters[key]);
		});
		router.push(`/courses/search?${newSearchParams.toString()}`);
	};

	// Handle sort change
	const handleSortChange = (value: string) => {
		handleFilterChange({ sort: value });
	};

	// Handle clearing filters
	const clearFilters = () => {
		router.push(`/courses/search?query=${query}`);
	};

	return (
		<Section className="container">
			<SearchInput inputValue={query!} />
			<h1 className="text-3xl font-bold my-4">
				{formatNumberWithCommas(courses.length)} results for {`"${query}"`}
			</h1>

			{/* Filters */}
			<div className="mb-6">
				<div className="flex space-x-4">
					{/* Category Filter */}
					<Select
						value={category}
						onValueChange={(value) => handleFilterChange({ category: value })}
					>
						<SelectTrigger className="border p-2 rounded-md">
							<SelectValue placeholder="All Categories" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all-categories">All Categories</SelectItem>
							<SelectItem value="Development">Development</SelectItem>
							<SelectItem value="Design">Design</SelectItem>
							{/* Add more categories as needed */}
						</SelectContent>
					</Select>

					{/* Level Filter */}
					<Select
						value={level}
						onValueChange={(value) => handleFilterChange({ level: value })}
					>
						<SelectTrigger className="border p-2 rounded-md">
							<SelectValue placeholder="All Levels" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all-levels">All Levels</SelectItem>
							<SelectItem value="Beginner">Beginner</SelectItem>
							<SelectItem value="Intermediate">Intermediate</SelectItem>
							<SelectItem value="Advanced">Advanced</SelectItem>
						</SelectContent>
					</Select>

					{/* Min Rating Filter */}
					<Select
						value={minRating.toString()}
						onValueChange={(value) => handleFilterChange({ minRating: value })}
					>
						<SelectTrigger className="border p-2 rounded-md">
							<SelectValue placeholder="All Ratings" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="0">All Ratings</SelectItem>
							<SelectItem value="4">4 & Up</SelectItem>
							<SelectItem value="3">3 & Up</SelectItem>
							<SelectItem value="2">2 & Up</SelectItem>
						</SelectContent>
					</Select>

					{/* Max Price Filter */}
					<input
						type="number"
						placeholder="Max Price"
						value={maxPrice}
						onChange={(e) => handleFilterChange({ maxPrice: e.target.value })}
						className="border p-2 rounded-md"
					/>
				</div>

				{/* Clear Filters Button */}
				<div className="mt-4">
					<Button onClick={clearFilters} variant="outline">
						Clear Filters
					</Button>
				</div>
			</div>

			{/* Sort Option */}
			<div className="mb-4">
				<label htmlFor="sort" className="mr-2">
					Sort By:
				</label>
				<Select value={sort} onValueChange={handleSortChange}>
					<SelectTrigger className="border p-2 rounded-md">
						<SelectValue placeholder="Sort By" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="relevance">Relevance</SelectItem>
						<SelectItem value="rating">Rating</SelectItem>
						<SelectItem value="price">Price</SelectItem>
						<SelectItem value="enrollment">Enrollment</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Loading Spinner */}
			{isLoading ? (
				<Loader /> // Show spinner while loading
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{/* Display the courses */}
					{courses.length > 0 ? (
						courses.map((course: ICourse, idx) => (
							<CourseCard key={idx} course={course} />
						))
					) : (
						<p>No courses found.</p>
					)}
				</div>
			)}
		</Section>
	);
}

export default SearchCourse;
