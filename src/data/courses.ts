// data/courses.ts

import { Course } from "../types/course";

export const sampleCourses: Course[] = [
	{
		id: "1",
		title: "Introduction to JavaScript",
		rating: 4.7,
		numRatings: 120,
		numStudents: 300,
		price: 29.99,
		description:
			"Learn the basics of JavaScript and start coding your own applications.",
		image: "/images/hero-background.jpg",
		duration: 5, // Duration in hours
		tags: ["JavaScript", "Programming", "Web Development"],
		category: "Programming",
	},
	{
		id: "2",
		title: "Advanced React",
		rating: 4.9,
		numRatings: 85,
		numStudents: 150,
		price: 39.99,
		description:
			"Dive deep into advanced React concepts and learn to build scalable applications.",
		image: "/images/hero-background.jpg",
		duration: 7, // Duration in hours
		tags: ["React", "JavaScript", "Frontend Development"],
		category: "Frontend",
	},
	{
		id: "3",
		title: "Machine Learning Basics",
		rating: 4.6,
		numRatings: 90,
		numStudents: 200,
		price: 49.99,
		description:
			"An introduction to machine learning techniques and algorithms.",
		image: "/images/hero-background.jpg",
		duration: 8, // Duration in hours
		tags: ["Machine Learning", "Data Science", "AI"],
		category: "Data Science",
	},
	{
		id: "4",
		title: "UI/UX designing",
		rating: 4.6,
		numRatings: 90,
		numStudents: 200,
		price: 2,
		description: "An introduction to ui/ux techniques and algorithms.",
		image: "/images/hero-background.jpg",
		duration: 8, // Duration in hours
		tags: ["Design"],
		category: "Designing",
	},
	{
		id: "5",
		title: "YOGA & Meditation",
		rating: 4.6,
		numRatings: 90,
		numStudents: 200,
		price: 4999,
		description: "From introduction to deep dive in yoga and meditation.",
		image: "/images/hero-background.jpg",
		duration: 8, // Duration in hours
		tags: ["Yoga", "Meditation", "Exercise"],
		category: "Meditation",
	},
];
