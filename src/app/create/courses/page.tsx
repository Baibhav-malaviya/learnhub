"use client";
import Section from "@/components/myComponents/Section";
import React, { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useCreatedCourse } from "@/store/creator";
import mongoose from "mongoose";
import { redirect } from "next/navigation";

const dummyCourses = [
	{
		_id: "1",
		title: "Introduction to React",
		description:
			"Learn the basics of React, including components, state, and props.",
		price: 29.99,
		category: "Development",
		thumbnailUrl: "https://via.placeholder.com/400x250?text",
		instructor: "Jane Doe",
		rating: 4.5,
		numRatings: 150,
	},
	{
		_id: "2",
		title: "Advanced CSS Techniques",
		description:
			"Master advanced CSS techniques and create stunning web designs.",
		price: 49.99,
		category: "Design",
		thumbnailUrl: "https://via.placeholder.com/400x250?text=CSS+Course",
		instructor: "John Smith",
		rating: 4.7,
		numRatings: 200,
	},
	{
		_id: "3",
		title: "Node.js and Express",
		description: "Build scalable web applications with Node.js and Express.",
		price: 39.99,
		category: "Development",
		thumbnailUrl: "https://via.placeholder.com/400x250?text=Node.js+Course",
		instructor: "Emily Johnson",
		rating: 4.6,
		numRatings: 180,
	},
];

function Courses() {
	const [isPageLoading, setIsPageLoading] = useState(false);
	const { courses, fetchCourses } = useCreatedCourse();
	useEffect(() => {
		setIsPageLoading(true);
		try {
			fetchCourses();
		} catch (error) {
			console.log("Error in fetching the courses for creator: ", error);
		} finally {
			setIsPageLoading(false);
		}
	}, [fetchCourses]);

	const handleEdit = (courseId: mongoose.Types.ObjectId) => {
		// Handle the edit action here
		// alert(`Edit button clicked for course ID: ${courseId}`);
		redirect(`/create/courses/${courseId}`);
	};

	return (
		<Section className="container px-0">
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-end ">
				<Card className="bg-secondary/10 hover:hover-card min-h-44">
					<Link
						href={"/create/new"}
						className="h-full w-full flex items-center justify-center"
					>
						<span className="h-auto w-auto rounded-full bg-primary p-2 text-background">
							<Plus />
						</span>
					</Link>
				</Card>
				{isPageLoading ? (
					<Section className="h-40 w-60">
						<h1 className="bg-secondary p-20 rounded animate-pulse ">
							Page Loading...
						</h1>
					</Section>
				) : (
					courses.map((course, idx) => <CourseCard key={idx} course={course} />)
				)}
			</div>
		</Section>
	);
}

export default Courses;
