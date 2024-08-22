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
import UpdateLessonForm from "./UpdateLessonForm";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

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
							<AccordionTrigger className=" py-0">
								<Table className="w-full">
									<TableBody>
										<TableRow>
											<TableCell className="text-left ">
												{lesson.title}
											</TableCell>
											<TableCell className="text-left ">
												{lesson.duration ? `${lesson.duration} minutes` : "N/A"}
											</TableCell>

											<TableCell className="text-right ">
												{lesson.preview ? "Preview Available" : "No Preview"}
											</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</AccordionTrigger>
							<AccordionContent>
								<UpdateLessonForm
									courseId={courseId as string}
									sectionId={sectionId as string}
									lesson={lesson}
									onUpdateLesson={(updatedLesson: ILesson) => {
										setLessons((prevLessons) =>
											prevLessons.map((lesson) =>
												lesson._id === updatedLesson._id
													? updatedLesson
													: lesson
											)
										);
									}}
								/>
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</CardContent>
		</Card>
	);
};

export default DisplayLesson;
