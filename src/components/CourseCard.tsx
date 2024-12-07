import React from "react";
import Image from "next/image";
import { Course } from "./FeaturedCourses";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import EnrollButton from "./EnrollButton";

interface CourseCardProps {
	course: Course;
}

const getStarRating = (rating: number) => {
	const stars = [];
	for (let i = 0; i < 5; i++) {
		stars.push(
			<Star
				key={i}
				className={`w-4 h-4 ${
					i < rating ? "text-yellow-500" : "text-muted-foreground"
				}`}
			/>
		);
	}
	return stars;
};

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
	return (
		<Card className="flex flex-col bg-background w-full max-w-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
			<div className="relative w-full h-48">
				<Image
					src={course.thumbnailUrl}
					alt={course.title}
					layout="fill"
					objectFit="cover"
					className="transition-transform duration-300 hover:scale-105"
				/>
				<Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
					${course.price.toFixed(2)}
				</Badge>
			</div>
			<CardContent className="flex-1 p-4">
				<h3 className="font-serif text-2xl font-bold mb-2 text-primary leading-tight">
					{course.title}
				</h3>

				{course.averageRating > 0 && (
					<div className="flex items-center space-x-4 text-sm mb-3">
						<div className="flex items-center space-x-1">
							{getStarRating(course.averageRating)}
							<span className="ml-1 text-sm text-foreground">
								{course.averageRating.toFixed(1)}
							</span>
						</div>
					</div>
				)}
			</CardContent>
			<CardFooter className="p-4 pt-0">
				<EnrollButton courseId={course.id} coursePrice={course.price} />
			</CardFooter>
		</Card>
	);
};

export default CourseCard;

// // Helper function to render star ratings
// const getStarRating = (rating: number) => {
// 	const fullStars = Math.floor(rating);
// 	const hasHalfStar = rating % 1 >= 0.5;
// 	const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

// 	return (
// 		<div className="flex items-center">
// 			{/* Render full stars */}
// 			{Array.from({ length: fullStars }).map((_, index) => (
// 				<Star
// 					key={`full-${index}`}
// 					fill="#facc15"
// 					className="w-4 h-4 text-yellow-500"
// 				/>
// 			))}
// 			{/* Render half star */}
// 			{hasHalfStar && (
// 				<Star
// 					key="half"
// 					className="w-4 h-4 text-yellow-500"
// 					style={{ clipPath: "inset(0 50% 0 0)" }}
// 				/>
// 			)}
// 			{/* Render empty stars */}
// 			{Array.from({ length: emptyStars }).map((_, index) => (
// 				<Star key={`empty-${index}`} className="w-4 h-4 text-gray-300" />
// 			))}
// 		</div>
// 	);
// };
