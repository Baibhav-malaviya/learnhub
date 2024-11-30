"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, BookOpen, Clock, PlayCircle } from "lucide-react";
import CourseCard from "@/app/create/components/CourseCard";
import { IUser } from "@/model/user.model";
import { ICourse } from "@/model/course.model";
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";

interface CreatorPageProps {
	params: {
		creatorId: string;
	};
}

interface CreatorResponse {
	message: string;
	creator: IUser & {
		bio: string;
		totalCoursesCreated?: number;
		totalStudentsEnrolled?: number;
		totalVideoContentMins?: number;
	};
	courses: ICourse[];
}
const StatCard = ({
	icon: Icon,
	value,
	label,
}: {
	icon: React.ElementType;
	value: number | string;
	label: string;
}) => (
	<Card className="w-full shadow-md transition-transform duration-300 transform hover:scale-105 bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 rounded-lg p-4">
		<CardContent
			className="flex items-center justify-between p-5 md:p-6"
			style={{
				boxShadow:
					"0 0 3px 1px rgba(59, 130, 246, 0.3), inset 0 0 10px rgba(255, 255, 255, 0.1)",
			}}
		>
			<div className="flex items-center space-x-4 md:space-x-5">
				<div className="bg-blue-100 rounded-full p-3 md:p-4">
					<Icon className="w-6 h-6 md:w-7 md:h-7 text-blue-500" />
				</div>
				<div>
					<p className="text-xs md:text-sm font-medium text-blue-100 tracking-wide">
						{label}
					</p>
					<p className="text-xl md:text-2xl font-bold text-white">{value}</p>
				</div>
			</div>
		</CardContent>
	</Card>
);

const CreatorPage: React.FC<CreatorPageProps> = ({ params: { creatorId } }) => {
	const [creator, setCreator] = useState<CreatorResponse["creator"] | null>(
		null
	);
	const [courses, setCourses] = useState<ICourse[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchCreatorData = async () => {
			try {
				const { data } = await axios.get<CreatorResponse>(
					`/api/creator/${creatorId}`
				);

				setCreator(data.creator);
				setCourses(data.courses);
			} catch (err: any) {
				console.error("Error fetching creator details:", err);
				setError(
					err.response?.data?.message || "Failed to fetch creator details."
				);
			} finally {
				setLoading(false);
			}
		};

		fetchCreatorData();
	}, [creatorId]);

	const totalVideoContentMins = creator?.totalVideoContentMins || 0;
	const formattedValue =
		totalVideoContentMins < 60
			? `${totalVideoContentMins.toFixed(1)} mins`
			: `${(totalVideoContentMins / 60).toFixed(1)} hrs`;

	if (loading) {
		return (
			<div className="container mx-auto py-8 space-y-6">
				<div className="flex items-center space-x-4">
					<Skeleton className="h-24 w-24 rounded-full" />
					<div className="space-y-2">
						<Skeleton className="h-8 w-[250px]" />
						<Skeleton className="h-4 w-[200px]" />
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<Card className="w-full max-w-md mx-auto mt-8 border-destructive">
				<CardContent className="text-destructive-foreground bg-destructive p-6">
					{error}
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="container mx-auto py-8 max-w-6xl">
			<Card className="w-full p-6 mb-8 shadow-sm">
				<div className="flex flex-col md:flex-row items-start gap-6">
					<Avatar className="h-32 w-32 border-2 border-primary">
						<AvatarImage
							src={creator?.profileImage || "/default-avatar.png"}
							alt={creator?.name || "Profile"}
							className="object-cover"
						/>
						<AvatarFallback>{creator?.name?.charAt(0) || "C"}</AvatarFallback>
					</Avatar>

					<div className="text-center md:text-left space-y-2 flex-grow">
						<h1 className="text-2xl font-bold text-primary">
							{creator?.name || "Unknown Creator"}
						</h1>
						<Badge variant="secondary" className="capitalize">
							{creator?.role || "Creator"}
						</Badge>
					</div>
				</div>

				<div className="mt-6 text-center md:text-left">
					<p className="text-muted-foreground">
						{creator?.bio || "No bio available."}
					</p>

					<div className="mt-4 text-sm text-muted-foreground flex justify-between items-center">
						<p>
							<strong className="text-foreground">Email:</strong>{" "}
							<span className="text-xs">
								{creator?.email || "Not provided"}
							</span>
						</p>
					</div>

					{creator?.socialMediaLinks && (
						<div className="mt-4 flex justify-center md:justify-start gap-4">
							{creator.socialMediaLinks.facebook && (
								<a
									href={creator.socialMediaLinks.facebook}
									target="_blank"
									rel="noopener noreferrer"
									className="text-[#1877F2] transition-all duration-300 hover:scale-110 p-2 bg-secondary rounded-lg"
									aria-label="Facebook"
								>
									<Facebook className="w-6 h-6" />
								</a>
							)}

							{creator.socialMediaLinks.twitter && (
								<a
									href={creator.socialMediaLinks.twitter}
									target="_blank"
									rel="noopener noreferrer"
									className="text-[#1DA1F2] transition-all duration-300 hover:scale-110 p-2 bg-secondary rounded-lg"
									aria-label="Twitter"
								>
									<Twitter className="w-6 h-6" />
								</a>
							)}

							{creator.socialMediaLinks.linkedin && (
								<a
									href={creator.socialMediaLinks.linkedin}
									target="_blank"
									rel="noopener noreferrer"
									className="text-[#0A66C2] transition-all duration-300 hover:scale-110 p-2 bg-secondary rounded-lg"
									aria-label="LinkedIn"
								>
									<Linkedin className="w-6 h-6" />
								</a>
							)}

							{creator.socialMediaLinks.instagram && (
								<a
									href={creator.socialMediaLinks.instagram}
									target="_blank"
									rel="noopener noreferrer"
									className="text-[#E4405F] transition-all duration-300 hover:scale-110 p-2 bg-secondary rounded-lg"
									aria-label="Instagram"
								>
									<Instagram className="w-6 h-6" />
								</a>
							)}

							{creator.socialMediaLinks.youtube && (
								<a
									href={creator.socialMediaLinks.youtube}
									target="_blank"
									rel="noopener noreferrer"
									className="text-[#FF0000] transition-all duration-300 hover:scale-110 p-2 bg-secondary rounded-lg"
									aria-label="YouTube"
								>
									<Youtube className="w-6 h-6" />
								</a>
							)}
						</div>
					)}
				</div>
			</Card>

			{/* Creator Statistics */}
			<div className="flex  gap-4 mb-8">
				<StatCard
					icon={BookOpen}
					value={creator?.totalCoursesCreated || 0}
					label="Total Courses"
				/>
				<StatCard
					icon={Users}
					value={creator?.totalStudentsEnrolled || 0}
					label="Students Enrolled"
				/>
				<StatCard icon={Clock} value={formattedValue} label="Video Content" />
			</div>

			{courses.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
					{courses.map((course: ICourse) => (
						<CourseCard key={course.id} course={course} />
					))}
				</div>
			) : (
				<Card className="text-center">
					<CardContent className="p-6 text-muted-foreground">
						This creator has not published any courses yet.
					</CardContent>
				</Card>
			)}
		</div>
	);
};

export default CreatorPage;
