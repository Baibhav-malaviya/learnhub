// components/InstructorSpotlightSection.tsx
import InstructorCard from "./InstructorCard";
import { Instructor } from "./InstructorCard";
import Section from "./myComponents/Section";

const instructors: Instructor[] = [
	{
		id: "1",
		name: "Dr. Jane Smith",
		bio: "Expert in Data Science and Machine Learning.",
		profilePictureUrl: "/images/instructor.jpg",
		courses: [
			{
				id: "1",
				title: "Introduction to Machine Learning",
				slug: "/courses/machine-learning",
			},
			{
				id: "2",
				title: "Advanced Data Science",
				slug: "/courses/data-science",
			},
		],
	},
	{
		id: "2",
		name: "John Doe",
		bio: "Specialist in Web Development and JavaScript.",
		profilePictureUrl: "/images/instructor.jpg",
		courses: [
			{
				id: "3",
				title: "JavaScript for Beginners",
				slug: "/courses/javascript",
			},
			{
				id: "4",
				title: "Full-Stack Web Development",
				slug: "/courses/web-development",
			},
		],
	},
	// Add more instructors here
];

const InstructorSection = () => (
	<Section className="container ">
		<h2 className="text-2xl font-bold text-center mb-6">
			Meet Our Top Instructors
		</h2>
		<div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
			{instructors.map((instructor) => (
				<InstructorCard key={instructor.id} instructor={instructor} />
			))}
		</div>
	</Section>
);

export default InstructorSection;
