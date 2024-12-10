import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "./ui/card";
import { generateSlug } from "@/utils/commonFunc";

interface Course {
	id: string;
	slug: string;
	title: string;
}

export interface Instructor {
	id: string;
	profilePictureUrl: string;
	name: string;
	bio: string;
	courses: Course[];
}

interface InstructorCardProps {
	instructor: Instructor;
}

const InstructorCard: React.FC<InstructorCardProps> = ({ instructor }) => (
	<Card className="hover:shadow-lg transition-shadow duration-300">
		<CardContent className="flex flex-col sm:flex-row items-center sm:items-start p-6">
			<Image
				src={instructor.profilePictureUrl}
				alt={`Profile picture of ${instructor.name}`}
				width={80}
				height={80}
				className="rounded-full mb-4 sm:mb-0 sm:mr-6"
			/>
			<div>
				<h3 className="text-2xl font-bold mb-2">{instructor.name}</h3>
				<p className="text-sm text-gray-600">{instructor.bio}</p>
			</div>
		</CardContent>
		<CardFooter className="flex flex-col items-start p-6">
			<h4 className="text-lg font-semibold mb-3">Courses Offered:</h4>
			<ul className="space-y-2 w-full">
				{instructor.courses.map((course) => (
					<li key={course.id} className="flex items-center">
						<span className="text-primary mr-2">•</span>
						<Link
							href={`/courses/search?query=${generateSlug(course.slug)}`}
							className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
						>
							{course.title}
						</Link>
					</li>
				))}
			</ul>
		</CardFooter>
	</Card>
);

export default InstructorCard;
