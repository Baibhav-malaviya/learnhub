"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import Section from "@/components/myComponents/Section";
import SectionsAccordion from "../../components/SectionsAccordion";
import { ISection } from "../../components/SectionsAccordion";
import { formatMongoDBDate } from "@/utils/commonFunc";
import { ILesson } from "@/model/course.model";
import { Button } from "@/components/ui/button";
import VideoPlayer from "@/components/videoPlayer";

interface ICourse {
	_id: string;
	title: string;
	description: string;
	thumbnailUrl: string;
	sections: ISection[];
	updatedAt: Date;
}

export default function LearnPage() {
	const { id } = useParams();
	const [course, setCourse] = useState<ICourse | null>(null);
	const [loading, setLoading] = useState(true);
	const [isEnrolled, setIsEnrolled] = useState(false);
	const [currentLesson, setCurrentLesson] = useState<ILesson | null>(null);
	const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
	const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

	// Function to handle the "Next" button click
	const handleNextLesson = () => {
		if (!course) return;

		const currentSection = course.sections[currentSectionIndex];
		if (currentLessonIndex < currentSection.lessons.length - 1) {
			// Move to the next lesson in the current section
			setCurrentLessonIndex(currentLessonIndex + 1);
			setCurrentLesson(currentSection.lessons[currentLessonIndex + 1]);
		} else if (currentSectionIndex < course.sections.length - 1) {
			// Move to the first lesson of the next section
			const nextSectionIndex = currentSectionIndex + 1;
			setCurrentSectionIndex(nextSectionIndex);
			setCurrentLessonIndex(0);
			setCurrentLesson(course.sections[nextSectionIndex].lessons[0]);
		} else {
			console.log("You have completed the course!");
		}
	};

	// Function to handle the "Previous" button click
	const handlePrevLesson = () => {
		if (!course) return;

		if (currentLessonIndex > 0) {
			// Move to the previous lesson in the current section
			setCurrentLessonIndex(currentLessonIndex - 1);
			setCurrentLesson(
				course.sections[currentSectionIndex].lessons[currentLessonIndex - 1]
			);
		} else if (currentSectionIndex > 0) {
			// Move to the last lesson of the previous section
			const prevSectionIndex = currentSectionIndex - 1;
			setCurrentSectionIndex(prevSectionIndex);
			const lastLessonIndex =
				course.sections[prevSectionIndex].lessons.length - 1;
			setCurrentLessonIndex(lastLessonIndex);
			setCurrentLesson(
				course.sections[prevSectionIndex].lessons[lastLessonIndex]
			);
		} else {
			console.log("You are at the beginning of the course.");
		}
	};

	useEffect(() => {
		const fetchCourse = async () => {
			try {
				const response = await fetch(`/api/courses/fetch/course/${id}`);
				const data = await response.json();
				setCourse(data.course);
				setIsEnrolled(data.isEnrolled);
				console.log("isEnrolled: ", isEnrolled);
				if (
					data.course.sections.length > 0 &&
					data.course.sections[0].lessons.length > 0
				) {
					setCurrentLesson(data.course.sections[0].lessons[0]); // Set the first lesson as default
					setCurrentSectionIndex(0);
					setCurrentLessonIndex(0);
				}
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
				<Skeleton className="animate-pulse h-64 w-full mb-4" />
				<Skeleton className="animate-pulse h-8 w-2/3 mb-2" />
				<Skeleton className="animate-pulse h-4 w-full mb-4" />
				<Skeleton className="animate-pulse h-20 w-full mb-4" />
			</Section>
		);
	}

	if (!course) {
		return <div className="container mx-auto p-4">Course not found.</div>;
	}

	return (
		<Section className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
			<div className="md:col-span-2">
				{/* Video Player */}
				<div className="mb-4">
					{currentLesson?.videoUrl ? (
						<VideoPlayer src={currentLesson.videoUrl} />
					) : (
						<div className="w-full aspect-[16/9] text-center bg-slate-700/50 text-primary">
							{" "}
							Video preparing...
						</div>
					)}
				</div>

				{/* Course Details */}
				<div>
					<h1 className="text-2xl font-bold">{course.title}</h1>
					<p className="text-muted-foreground mb-2">
						Last updated:{" "}
						<span className="italic">
							{formatMongoDBDate(course.updatedAt)}
						</span>
					</p>
					<p className="text-base text-muted-foreground">
						{course.description}
					</p>
				</div>

				{/* Navigation Buttons */}
				<div className="flex justify-between mt-4">
					<Button
						onClick={handlePrevLesson}
						disabled={currentSectionIndex === 0 && currentLessonIndex === 0}
					>
						Previous
					</Button>
					<Button
						onClick={handleNextLesson}
						disabled={
							currentSectionIndex === course.sections.length - 1 &&
							currentLessonIndex ===
								course.sections[currentSectionIndex].lessons.length - 1
						}
					>
						Next
					</Button>
				</div>
			</div>

			{/* Sections and Lessons Accordion */}
			<div>
				<SectionsAccordion
					sections={course.sections}
					isEnrolled={isEnrolled}
					onLessonClick={(lesson) => {
						setCurrentLesson(lesson);
					}}
				/>
			</div>
		</Section>
	);
}
