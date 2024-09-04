"use client";
import React, { useState, useEffect } from "react";

import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { ILesson } from "@/model/course.model";
import { useParams } from "next/navigation";

const DisplayLesson = () => {
	const [lessons, setLessons] = useState<ILesson[] | []>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const { courseId, sectionId } = useParams();

	useEffect(() => {
		const fetchLessons = async () => {
			if (!courseId || !sectionId) return;

			setIsLoading(true);
			try {
				const response = await axios.get(
					`/api/courses/fetch/lessons?courseId=${courseId}&sectionId=${sectionId}`
				);
				console.log("Response: ", response);
				if (response.data.success) {
					setLessons(response.data.lessons);
				} else {
					setError(response.data.error);
				}
			} catch (err) {
				setError("Failed to fetch lessons. Please try again later.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchLessons();
	}, [courseId, sectionId]);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-64">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	if (error) {
		return (
			<Alert variant="destructive">
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>{error}</AlertDescription>
			</Alert>
		);
	}

	return (
		<Card className="mt-4">
			<CardHeader>
				<CardTitle>Course Lessons</CardTitle>
			</CardHeader>
			<CardContent>
				<Accordion type="single" collapsible className="w-full">
					{lessons.map((lesson, idx) => (
						<AccordionItem key={idx} value={`item-${idx}`}>
							<AccordionTrigger>{lesson.title}</AccordionTrigger>
							<AccordionContent>
								<p>{lesson.content}</p>
								{lesson.videoUrl && (
									<p className="mt-2">
										<strong>Video:</strong>{" "}
										<span className="text-blue-500 underline">
											{lesson.videoUrl}{" "}
										</span>
									</p>
								)}
								{lesson.duration && (
									<p className="mt-2">
										<strong>Duration:</strong> {lesson.duration} minutes
									</p>
								)}
								{lesson.preview !== undefined && (
									<p className="mt-2">
										<strong>Preview available:</strong>{" "}
										{lesson.preview ? "Yes" : "No"}
									</p>
								)}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</CardContent>
		</Card>
	);
};

export default DisplayLesson;
