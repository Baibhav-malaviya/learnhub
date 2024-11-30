import React from "react";
import { Edit } from "lucide-react"; // Import the edit icon from Lucide
import Link from "next/link";
import { truncateString } from "@/utils/commonFunc";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ICourse } from "@/model/course.model";
import { useUser } from "@clerk/nextjs";
import BuyCourseButton from "@/components/BuyCourseButton";

interface CourseCardProps {
	course: ICourse;
	// onEdit: (courseId: mongoose.Types.ObjectId) => void; // Function to handle edit button click with course ID
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
	const { user } = useUser();
	const isCreator = course?.creator?.clerkUserId == user?.id;
	// console.log(course?.creator?.clerkUserId, " : ", user?.id);

	return (
		<Link href={`/course/${course._id}`}>
			<Card
				className="relative w-auto h-auto bg-cover bg-center overflow-hidden rounded-xl flex flex-col transition-transform duration-300 transform hover:shadow-md"
				style={{
					backgroundImage: `url(${
						course?.thumbnailUrl ?? "https://via.placeholder.com/400x250?text"
					})`,
					backgroundColor: "rgba(0, 0, 0, 0.5)",
					backgroundBlendMode: "overlay",
				}}
			>
				{/* Content Section */}
				<div className="flex-1 p-4">
					<CardHeader className="mb-2">
						<CardTitle className="text-lg font-semibold text-white truncate">
							{course.title}
						</CardTitle>
						<CardDescription className="text-gray-300 text-sm mt-1">
							{truncateString(course.description, 100)}
						</CardDescription>
					</CardHeader>
					<CardContent className="mt-2 text-sm text-gray-200 flex justify-between">
						<p className="truncate">
							Category: <Badge variant={"secondary"}>{course.category}</Badge>
						</p>
						<p className="truncate text-lg italic pr-2">
							<span className="font-medium">${course.price.toFixed(2)}</span>
						</p>
					</CardContent>
				</div>
				{/* Edit Button */}
				{isCreator && (
					<Link href={`/create/courses/${course._id}`}>
						<Edit className="w-5 h-5 absolute top-4 right-4 text-white hover:text-gray-300 hover:cursor-pointer" />
					</Link>
				)}
			</Card>
			<BuyCourseButton courseId={course._id} />
		</Link>
	);
};

export default CourseCard;
