"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import SubmitButton from "@/components/SubmitButton";

// Define the type for form data based on the ISocialMediaLinks and bio
interface UserProfileFormData {
	bio?: string;
	socialMediaLinks?: {
		facebook?: string;
		twitter?: string;
		linkedin?: string;
		instagram?: string;
		youtube?: string;
	};
}

const UserProfile: React.FC = () => {
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState<UserProfileFormData>({
		bio: "",
		socialMediaLinks: {
			facebook: "",
			twitter: "",
			linkedin: "",
			instagram: "",
			youtube: "",
		},
	});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchUserProfile = async () => {
			try {
				const response = await axios.get("/api/profile");
				const userData = response.data.user;
				console.log("userData: ", userData);
				setFormData({
					bio: userData.bio || "",
					socialMediaLinks: {
						facebook: userData.socialMediaLinks?.facebook || "",
						twitter: userData.socialMediaLinks?.twitter || "",
						linkedin: userData.socialMediaLinks?.linkedin || "",
						instagram: userData.socialMediaLinks?.instagram || "",
						youtube: userData.socialMediaLinks?.youtube || "",
					},
				});
			} catch (error) {
				console.error("Failed to fetch user profile", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchUserProfile();
	}, []);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSocialMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			socialMediaLinks: {
				...prev.socialMediaLinks,
				[name]: value,
			},
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const response = await axios.put("/api/profile", formData, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (response.data.success) {
				setFormData(response.data.user);
				setIsEditing(false);
				alert(response.data.message);
			} else {
				alert(response.data.message);
			}
		} catch (error) {
			console.error("Profile update failed", error);
			alert("Failed to update profile");
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return <UserProfileSkeleton />;
	}

	return (
		<Card className="w-full shadow-none">
			<CardHeader>
				<CardTitle className="flex justify-end items-center">
					{!isEditing && (
						<Button variant="outline" onClick={() => setIsEditing(true)}>
							Edit Profile
						</Button>
					)}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-2">Bio</label>
						<Textarea
							name="bio"
							value={formData.bio}
							onChange={handleInputChange}
							disabled={!isEditing}
							placeholder="Tell us about yourself"
							className="resize-none"
						/>
					</div>
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Social Media Links</h3>
						{[
							{ name: "facebook", label: "Facebook" },
							{ name: "twitter", label: "Twitter" },
							{ name: "linkedin", label: "LinkedIn" },
							{ name: "instagram", label: "Instagram" },
							{ name: "youtube", label: "YouTube" },
						].map(({ name, label }) => (
							<div key={name}>
								<label className="block text-sm font-medium mb-2">
									{label}
								</label>
								<Input
									name={name}
									value={
										formData.socialMediaLinks?.[
											name as keyof typeof formData.socialMediaLinks
										]
									}
									onChange={handleSocialMediaChange}
									disabled={!isEditing}
									placeholder={`Enter your ${label} profile URL`}
								/>
							</div>
						))}
					</div>
					{isEditing && (
						<div className="flex space-x-2 mt-4">
							<SubmitButton
								isLoading={isLoading}
								loadingText="Updating Profile"
							>
								Save Changes
							</SubmitButton>
							<Button
								type="button"
								variant="outline"
								onClick={() => setIsEditing(false)}
							>
								Cancel
							</Button>
						</div>
					)}
				</form>
			</CardContent>
		</Card>
	);
};

const UserProfileSkeleton: React.FC = () => {
	return (
		<div className="w-full mx-auto my-8">
			<Card className="shadow-none border-none">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<Skeleton className="h-6 w-1/2" />
					<Skeleton className="h-10 w-24" />
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-4">
						<div className="space-y-2">
							<Skeleton className="h-4 w-1/4" />
							<Skeleton className="h-24 w-full" />
						</div>
						<div className="space-y-2">
							<Skeleton className="h-6 w-1/2" />
							{[1, 2, 3, 4, 5].map((item) => (
								<div key={item} className="space-y-2">
									<Skeleton className="h-4 w-1/4" />
									<Skeleton className="h-10 w-full" />
								</div>
							))}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default UserProfile;
