// components/InstructorSpotlightSection.tsx
import InstructorCard from "./InstructorCard";
import { Instructor } from "./InstructorCard";
import Section from "./myComponents/Section";

const instructors: Instructor[] = [
	{
		id: "1",
		name: "Preenu mittan",
		bio: "Expert in MERN",
		profilePictureUrl: "/images/instructor.jpg",
		courses: [
			{
				id: "1",
				title: "Node beginner to advance",
				slug: "Node js beginner",
			},
			{
				id: "2",
				title: "React  and intro to Next js",
				slug: "react and next js",
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
				slug: "Javascript",
			},
			{
				id: "4",
				title: "Testing title",
				slug: "testing",
			},
		],
	},
	{
		id: "3",
		name: "Ansh gupta",
		bio: "Specialist of Poem.",
		profilePictureUrl: "/images/instructor.jpg",
		courses: [
			{
				id: "5",
				title: "अलंकार (Alankar)",
				slug: "Alankar",
			},
			{
				id: "6",
				title: "Ras (रास)",
				slug: "ras",
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
