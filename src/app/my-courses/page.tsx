"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/components/hooks/use-toast"; // Shadcn toast hook
import CourseCard from "../create/components/CourseCard";
import { Skeleton } from "@/components/ui/skeleton";

import { ICourse } from "@/model/course.model";

export default function MyCourses() {
	const [courses, setCourses] = useState<ICourse[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const { toast } = useToast();

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const response = await axios.get("/api/my-courses");
				setCourses(response.data.courses);
			} catch (error: any) {
				toast({
					title: "Error",
					description:
						error.response?.data?.message || "Failed to fetch courses",
					variant: "destructive",
				});
			} finally {
				setLoading(false);
			}
		};

		fetchCourses();
	}, [toast]);

	return (
		<div className="container mx-auto p-4">
			{loading ? (
				// Skeleton Loader for loading state
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{[...Array(6)].map((_, index) => (
						<Skeleton key={index} className="w-full h-32" />
					))}
				</div>
			) : courses.length > 0 ? (
				// Render courses using CourseCard
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{courses.map((course) => (
						<CourseCard key={course.id} course={course} />
					))}
				</div>
			) : (
				// Fallback if no courses found
				<p className="text-gray-500">
					You are not enrolled in any courses yet.
				</p>
			)}
		</div>
	);
}
