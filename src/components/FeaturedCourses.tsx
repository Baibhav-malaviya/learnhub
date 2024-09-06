import React, { useEffect, useState } from "react";
import Section from "./myComponents/Section";
import CourseCard from "./CourseCard";
import axios from "axios";
import { useToast } from "./hooks/use-toast"; // Assuming you have a toast hook
import { Loader } from "lucide-react";

export interface Course {
	id: string;
	title: string;
	description: string;
	thumbnailUrl: string;
	category: string;
	price: number;
	language: string;
	averageRating: number;
	enrollmentCount: number;
}

function FeaturedCourses() {
	const [courses, setCourses] = useState<Course[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { toast } = useToast(); // Using toast for notifications

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const { data } = await axios.get("/api/courses/fetch/courses?limit=5");
				setCourses(data.courses);
				setIsLoading(false);
			} catch (err) {
				console.error("Failed to fetch courses:", err);
				setError("Failed to load courses. Please try again later.");
				setIsLoading(false);

				// Optionally show a toast notification for errors
				toast({
					title: "Error",
					description: "Failed to load courses. Please try again later.",
					variant: "destructive",
				});
			}
		};

		fetchCourses();
	}, [toast]);

	if (isLoading) {
		return (
			<Section className="flex justify-center items-center min-h-[200px] bg-background">
				<div className="flex items-center justify-center gap-4">
					<Loader className="animate-spin" />
					<span className="text-lg font-semibold">Loading courses...</span>
				</div>
			</Section>
		);
	}

	if (error) {
		return (
			<Section className="flex justify-center items-center min-h-[200px] bg-background">
				<p>{error}</p>
			</Section>
		);
	}

	return (
		<Section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 container bg-background">
			{courses.length > 0 ? (
				courses.map((course) => <CourseCard key={course.id} course={course} />)
			) : (
				<p className="col-span-full text-center">No courses available.</p>
			)}
		</Section>
	);
}

export default FeaturedCourses;
