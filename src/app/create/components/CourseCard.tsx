import React from "react";
import Image from "next/image";
import { Edit } from "lucide-react"; // Import the edit icon from Lucide
import { Button } from "@/components/ui/button"; // Shadcn button component
import { truncateString } from "@/utils/commonFunc";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ICourse } from "@/model/course.model";
import mongoose from "mongoose";

export interface Course {
	_id: string; // Make sure this matches your actual data structure
	title: string;
	description: string;
	price: number;
	category: string;
	thumbnailUrl: string;
	averageRating?: number; // Optional field
	// Add other properties as needed
}

interface CourseCardProps {
	course: ICourse;
	onEdit: (courseId: mongoose.Types.ObjectId) => void; // Function to handle edit button click with course ID
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onEdit }) => {
	return (
		<Card
			className="relative w-auto h-auto bg-cover bg-center overflow-hidden rounded-lg flex flex-col hover:hover-card"
			style={{
				backgroundImage: `url(${
					course?.thumbnailUrl ?? "https://via.placeholder.com/400x250?text"
				})`,
				backgroundColor: "rgba(0, 0, 0, 0.3)",
				backgroundBlendMode: "overlay",
			}}
		>
			{/* Content Section */}
			<div className="flex-1 ">
				<CardHeader>
					<CardTitle className="text-lg font-semibold text-white truncate">
						{course.title}
					</CardTitle>
					<CardDescription className="text-gray-300 text-sm mt-1">
						{truncateString(course.description, 100)}
					</CardDescription>
				</CardHeader>
			</div>
			<CardContent className="mt-2 text-sm text-gray-200 flex justify-between ">
				<p className="truncate">
					Category: <Badge variant={"secondary"}>{course.category}</Badge>
				</p>
				<p className="truncate text-lg italic pr-2">
					<span className="font-medium">${course.price.toFixed(2)}</span>
				</p>
			</CardContent>

			{/* Edit Button */}

			<Edit
				className="w-4 h-4 mr-1 absolute top-4 right-4 text-white hover:cursor-pointer"
				onClick={() => onEdit(course._id)}
			/>
		</Card>
	);
};

export default CourseCard;
