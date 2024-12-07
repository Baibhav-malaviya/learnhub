"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "./hooks/use-toast";
import { Loader } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useRequireAuth } from "./hooks/useRequireAuth";
import usePayment from "./hooks/usePayment"; // Import the usePayment hook

interface EnrollButtonProps {
	courseId: string;
	coursePrice: number; // Add course price as a prop
}

const EnrollButton = ({ courseId, coursePrice }: EnrollButtonProps) => {
	const [isLoading, setIsLoading] = useState(false);
	const [isEnrolled, setIsEnrolled] = useState(false);
	const { toast } = useToast();
	const { isSignedIn } = useAuth();
	const { requireAuth } = useRequireAuth();

	// Initialize the payment hook
	const { initiatePayment, loading: paymentLoading } = usePayment({
		courseId,
		amount: coursePrice,
	});

	useEffect(() => {
		if (isSignedIn) {
			const checkEnrollment = async () => {
				try {
					const response = await axios.get(
						`/api/enroll/check?courseId=${courseId}`
					);
					setIsEnrolled(response.data.enrolled);
				} catch (error) {
					console.error("Error checking enrollment:", error);
				}
			};

			checkEnrollment();
		}
	}, [courseId, isSignedIn]);

	const handleEnrollment = async () => {
		if (!requireAuth("enroll in this course")) return;

		// Check if course is free or paid
		if (coursePrice === 0) {
			// Free course enrollment flow
			setIsLoading(true);
			try {
				const response = await axios.post(`/api/enroll`, { courseId });

				if (response.status === 200) {
					toast({
						title: "Enrollment Successful",
						description: "You have been enrolled in the course.",
					});
					setIsEnrolled(true);
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
		} else {
			// Paid course - initiate payment
			try {
				await initiatePayment();
			} catch (error) {
				toast({
					variant: "destructive",
					title: "Payment Error",
					description: "Failed to initiate payment. Please try again.",
				});
			}
		}
	};

	// Render a Link if the user is enrolled
	if (isEnrolled) {
		return (
			<Link className="w-full" href={`/course/${courseId}/learn`}>
				<Button variant={"secondary"} className="w-full">
					Go to Course
				</Button>
			</Link>
		);
	}

	// Render the enrollment/payment button
	return (
		<Button
			onClick={handleEnrollment}
			disabled={isLoading || paymentLoading}
			className={`w-full ${
				isLoading || paymentLoading ? "opacity-70 cursor-not-allowed" : ""
			}`}
		>
			{isLoading || paymentLoading ? (
				<>
					<Loader className="animate-spin h-5 w-5 mr-2" />
					{paymentLoading ? "Redirecting to Payment..." : "Enrolling..."}
				</>
			) : coursePrice === 0 ? (
				"Enroll Now"
			) : (
				`Enroll - $${coursePrice}`
			)}
		</Button>
	);
};

export default EnrollButton;
