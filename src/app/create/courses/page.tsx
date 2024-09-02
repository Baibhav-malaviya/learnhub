"use client";
import Section from "@/components/myComponents/Section";
import React, { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useCreatedCourse } from "@/store/creator";
import mongoose from "mongoose";

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

/**
_id: "66d486483deb4ee17c1a5733"
averageRating: 0
​​category: "programming"
​​certificateOffered: false
​​createdAt: "2024-09-01T15:20:40.176Z"
​​creatorId: "66d3869fad40ecf643275338"
​​description: "This is beginner level devops course."
​​duration: 0
​​enrollmentCount: 0
​​id: "66d486483deb4ee17c1a5733"
​​isPublished: false
​​language: "english"
​​level: "Beginner"
​​prerequisites: Array [ "Basic HTML", "Basic css" ]
​​price: 25
​​reviews: Array []
​​savingsPercentage: 0
​​sections: Array [ {…} ]
​​skillsGained: Array []
​​studentsCompleted: 0
​​tags: Array []
​​title: "DevOps"
​​updatedAt: "2024-09-01T16:44:30.561Z"
 */

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
		alert(`Edit button clicked for course ID: ${courseId}`);
	};

	return (
		<Section className="container p-6 ">
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
				<Card className="bg-secondary/10 hover:hover-card">
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
					courses.map((course, idx) => (
						<CourseCard key={idx} course={course} onEdit={handleEdit} />
					))
				)}
			</div>
		</Section>
	);
}

export default Courses;
