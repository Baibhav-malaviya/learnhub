"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	formatMongoDBDate,
	generateCreatorUrl,
	getProfileInitials,
} from "@/utils/commonFunc";
import {
	Facebook,
	Twitter,
	Linkedin,
	Instagram,
	Youtube,
	LucideIcon,
} from "lucide-react";
import Section from "@/components/myComponents/Section";
import SectionsAccordion from "../components/SectionsAccordion";
import { ISection } from "../components/SectionsAccordion";
import Link from "next/link";
import EnrollButton from "@/components/EnrollButton";

export interface ICourse {
	_id: string;
	title: string;
	description: string;
	category: string;
	level: string;
	price: number;
	language: string;
	thumbnailUrl: string;
	creator: {
		_id: string;
		name: string;
		email: string;
		profileImage: string;
		bio: string;
		socialMediaLinks: {
			facebook?: string;
			twitter?: string;
			linkedin?: string;
			instagram?: string;
			youtube?: string;
		};
	};
	sections: ISection[];
	updatedAt: Date;
}

type SocialPlatform =
	| "facebook"
	| "twitter"
	| "linkedin"
	| "instagram"
	| "youtube";

interface SocialIconProps {
	platform: SocialPlatform;
	link?: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({ platform, link }) => {
	const icons: Record<SocialPlatform, LucideIcon> = {
		facebook: Facebook,
		twitter: Twitter,
		linkedin: Linkedin,
		instagram: Instagram,
		youtube: Youtube,
	};
	const Icon = icons[platform];
	return link ? (
		<a
			href={link}
			target="_blank"
			rel="noopener noreferrer"
			className="text-muted-foreground hover:text-foreground transition-colors"
		>
			<Icon size={20} />
		</a>
	) : null;
};

export default function CoursePage() {
	const { id } = useParams();

	const [course, setCourse] = useState<ICourse | null>(null);
	const [loading, setLoading] = useState(true);
	const [isEnrolled, setIsEnrolled] = useState(false);

	useEffect(() => {
		const fetchCourse = async () => {
			try {
				const response = await fetch(`/api/courses/fetch/course/${id}`);
				const data = await response.json();

				setCourse(data.course);
				setIsEnrolled(data.isEnrolled);
			} catch (error) {
				console.error("Error fetching course details:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchCourse();
	}, [id]);

	if (loading) {
		return (
			<Section className="container mx-auto p-4">
				<Skeleton className="h-64 w-full mb-4" />
				<Skeleton className="h-8 w-2/3 mb-2" />
				<Skeleton className="h-4 w-full mb-4" />
				<Skeleton className="h-20 w-full mb-4" />
				<div className="flex justify-between">
					<Skeleton className="h-10 w-1/4" />
					<Skeleton className="h-10 w-1/4" />
				</div>
			</Section>
		);
	}

	if (!course) {
		return <div className="container mx-auto p-4">Course not found.</div>;
	}

	return (
		<Section className="container mx-auto p-4">
			<Card>
				<Image
					src={course.thumbnailUrl}
					alt={course.title}
					className="w-full h-64 object-cover rounded-t-lg"
					width={1200}
					height={400}
				/>
				<CardHeader>
					<CardTitle className="text-2xl font-bold">{course.title}</CardTitle>
					<p className="text-base text-muted-foreground">
						{course.description}
					</p>
					<p className="text-sm text-muted-foreground">
						Last updated:{" "}
						<span className="italic">
							{formatMongoDBDate(course.updatedAt)}
						</span>
					</p>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col justify-between md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
						<div className="flex space-x-2 items-center ">
							<Avatar>
								<AvatarImage
									src={course.creator.profileImage}
									alt={course.creator.name}
								/>
								<AvatarFallback className=" font-semibold">
									{getProfileInitials(course.creator.name)}
								</AvatarFallback>
							</Avatar>
							<div className="flex flex-col items-start">
								<h2 className="text-base font-semibold mb-1">
									<span className="text-muted-foreground">Created by: </span>
									<Link
										// href={`/user/${course.creator._id}`}
										href={generateCreatorUrl(
											course.creator._id,
											course.creator.name
										)}
										className="underline italic font-sans"
									>
										{course.creator.name}
									</Link>
								</h2>
								<p className="text-xs text-muted-foreground">
									{course.creator.email}
								</p>
							</div>
						</div>

						<div className="flex justify-center md:justify-start space-x-4 ">
							{Object.entries(course.creator.socialMediaLinks || {}).map(
								([platform, link]) => (
									<SocialIcon
										key={platform}
										platform={platform as SocialPlatform}
										link={link}
									/>
								)
							)}
						</div>
					</div>
					<Separator className="my-6" />

					<div className="flex flex-wrap gap-2 mb-6">
						<Badge variant="secondary">{course.category}</Badge>
						<Badge variant="secondary">{course.level}</Badge>
						<Badge variant="secondary">{course.language}</Badge>
					</div>

					<div className="flex justify-between items-center">
						<p className="text-2xl font-bold">${course.price.toFixed(2)}</p>
						<div className="flex space-x-4">
							<EnrollButton courseId={course._id} />
						</div>
					</div>
				</CardContent>
			</Card>
			<SectionsAccordion sections={course.sections} isEnrolled={isEnrolled} />
		</Section>
	);
}
