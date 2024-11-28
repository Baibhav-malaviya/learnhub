"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "../hooks/use-toast";
import SubmitButton from "../SubmitButton";

// Define a type for the API response
interface SubscriptionResponse {
	success: boolean;
	message?: string;
	error?: string;
}

const NewsletterSignup: React.FC = () => {
	// State management
	const [email, setEmail] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	// Toast hook for notifications
	const { toast } = useToast();

	// Email validation function
	const isValidEmail = (emailToCheck: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(emailToCheck);
	};

	const handleSubscribe = async (e: any) => {
		e.preventDefault();
		// Validate email before submission
		if (!email || !isValidEmail(email)) {
			toast({
				title: "Invalid Email",
				description: "Please enter a valid email address.",
				variant: "destructive",
			});
			return;
		}

		// Start loading state
		setLoading(true);

		try {
			// Use Axios for API call with type safety
			const response = await axios.post<SubscriptionResponse>(
				"/api/newsletter",
				{
					email,
					name: email.split("@")[0], // Extract name from email for personalization
				},
				{
					// Axios-specific configuration
					headers: {
						"Content-Type": "application/json",
					},
					// Add timeout to handle potential network issues
					timeout: 5000,
				}
			);

			// Check response based on Axios success
			if (response.data.success) {
				toast({
					title: "Subscription Successful",
					description: "Thank you for subscribing to our newsletter!",
					variant: "default",
				});

				// Clear email input after successful subscription
				setEmail("");
			} else {
				// Handle API-level errors
				throw new Error(response.data.message || "Subscription failed");
			}
		} catch (error) {
			// Differentiate between Axios errors and other errors
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<SubscriptionResponse>;

				if (axiosError.response) {
					// The request was made and the server responded with a status code
					toast({
						title: "Subscription Error",
						description:
							axiosError.response.data.message ||
							"Server responded with an error. Please try again.",
						variant: "destructive",
					});
				} else if (axiosError.request) {
					// The request was made but no response was received
					toast({
						title: "Network Error",
						description:
							"No response received from the server. Please check your internet connection.",
						variant: "destructive",
					});
				} else {
					// Something happened in setting up the request
					toast({
						title: "Error",
						description: "An unexpected error occurred. Please try again.",
						variant: "destructive",
					});
				}
			} else {
				// Handle non-Axios errors
				toast({
					title: "Unexpected Error",
					description:
						(error as Error).message || "An unexpected error occurred.",
					variant: "destructive",
				});
			}
		} finally {
			// Always reset loading state
			setLoading(false);
		}
	};

	return (
		<section className="bg-secondary/40 text-secondary-foreground py-8 rounded-lg my-8">
			<div className="text-center max-w-xl mx-auto">
				<h2 className="text-2xl font-bold">Subscribe to our Newsletter</h2>
				<p className="text-muted-foreground mt-2">
					Get the latest posts and updates delivered directly to your inbox.
				</p>

				<form
					onSubmit={handleSubscribe}
					className="flex justify-center mt-4 space-x-2"
				>
					<Input
						type="email"
						placeholder="Enter your email address"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full max-w-md"
						disabled={loading}
					/>

					<SubmitButton isLoading={loading} loadingText="Subscribing">
						Subscribe
					</SubmitButton>
				</form>
			</div>
		</section>
	);
};

export default NewsletterSignup;
