"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "./hooks/use-toast"; // Assuming you have a toast hook
import { Loader } from "lucide-react"; // Adjust path as needed
import axios from "axios";
import Link from "next/link";

const EnrollButton = ({ courseId }: { courseId: string }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [isEnrolled, setIsEnrolled] = useState(false);
	const { toast } = useToast();

	console.log("courseId: ", courseId);

	useEffect(() => {
		const checkEnrollment = async () => {
			try {
				// Check if the user is already enrolled
				const response = await axios.get(
					`/api/enroll/check?courseId=${courseId}`
				);

				console.log("response: ", response.data);
				setIsEnrolled(response.data.enrolled);
			} catch (error: any) {
				console.error("Error checking enrollment:", error);
			}
		};

		checkEnrollment();
	}, [courseId]);

	console.log("isEnrolled: ", isEnrolled);

	const handleEnrollment = async () => {
		setIsLoading(true);
		try {
			// Call the enrollment API
			const response = await axios.post(`/api/enroll`, { courseId });

			if (response.status === 200) {
				toast({
					title: "Enrollment Successful",
					description: "You have been enrolled in the course.",
				});
				setIsEnrolled(true); // Update enrollment status
			} else {
				toast({
					variant: "destructive",
					title: "Enrollment Failed",
					description: response.data.message || "Something went wrong.",
				});
			}
		} catch (error: any) {
			toast({
				variant: "destructive",
				title: "Error",
				description:
					error.response?.data?.message || "Server error. Please try again.",
			});
		} finally {
			setIsLoading(false);
		}
	};

	// Render a Link if the user is enrolled
	if (isEnrolled) {
		return (
			<Link href={`/course/${courseId}/learn`}>
				<Button variant={"secondary"} className="w-full">
					Go to Course
				</Button>
			</Link>
		);
	}

	// Render the enrollment button if the user is not enrolled
	return (
		<Button
			onClick={handleEnrollment}
			disabled={isLoading}
			className={`w-full ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
		>
			{isLoading ? (
				<>
					<Loader className="animate-spin h-5 w-5 mr-2" />
					Enrolling...
				</>
			) : (
				"Enroll Now"
			)}
		</Button>
	);
};

export default EnrollButton;
