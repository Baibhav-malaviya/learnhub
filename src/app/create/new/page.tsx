"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { generateSlug } from "@/utils/commonFunc";
import { Loader } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@/components/hooks/use-toast";
import Section from "@/components/myComponents/Section";
import { useCreatedCourse } from "@/store/creator";
import SubmitButton from "@/components/SubmitButton";
import { Label } from "@/components/ui/label";

export interface IFormData {
	title: string;
	slug: string;
	description: string;
	category: string;
	price: string;
	level: "Beginner" | "Intermediate" | "Advanced";
	language: string;
}

const AddCoursePage = () => {
	// State to hold form data
	const [formData, setFormData] = useState<IFormData>({
		title: "",
		slug: "",
		description: "",
		category: "",
		price: "",
		level: "Beginner",
		language: "English", // Default value
	});
	// ["Beginner", "Intermediate", "Advanced"],
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { toast } = useToast();

	// Handle form input changes
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
			slug: name === "title" ? generateSlug(value) : prevData.slug, // Generate slug from title
		}));
		setError(null);
	};

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null); // Reset error state

		try {
			await useCreatedCourse.getState().addCourse(formData);
			// Clear form after successful submission (optional)
			setFormData({
				title: "",
				slug: "",
				description: "",
				category: "",
				price: "",
				level: "Beginner",
				language: "English",
			});

			toast({
				title: "Course Created successfully",
				description: "Add a lesson to publish",
			});
		} catch (error) {
			console.error("Error in creating course:", error);
			setError(
				"An error occurred while creating the course. Please try again."
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Section className="container mx-auto px-0">
			<h1 className="text-xl font-bold mb-4">Create New Course</h1>
			<form onSubmit={handleSubmit} className="space-y-4">
				{/* Course Title and Slug */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<Label className="block text-gray-700 mb-2">Course Title</Label>
						<Input
							type="text"
							name="title"
							value={formData.title}
							onChange={handleChange}
							required
							placeholder="Enter course title"
						/>
					</div>
					<div>
						<Label className="block text-gray-700 mb-2">Slug</Label>
						<Input
							type="text"
							name="slug"
							value={formData.slug}
							readOnly
							placeholder="Slug auto-generated from title"
						/>
					</div>
				</div>

				{/* Course Description */}
				<div>
					<Label>Description</Label>
					<Textarea
						name="description"
						value={formData.description}
						onChange={handleChange}
						required
						placeholder="Enter course description"
					/>
				</div>

				{/* Category and Price */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<Label>Category</Label>
						<Input
							type="text"
							name="category"
							value={formData.category}
							onChange={handleChange}
							required
							placeholder="Enter course category"
						/>
					</div>
					<div>
						<Label>Price</Label>
						<Input
							type="number"
							name="price"
							value={formData.price}
							onChange={handleChange}
							required
							placeholder="Enter course price"
						/>
					</div>
				</div>

				{/* Language */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<Label>Language</Label>
						<Select
							onValueChange={(value) => {
								setFormData((prevData) => ({
									...prevData,
									language: value,
								}));
							}}
							value={formData.language}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select Language" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Hindi">Hindi</SelectItem>
								<SelectItem value="English">English</SelectItem>
								<SelectItem value="Bhojpuri">Bhojpuri</SelectItem>
								<SelectItem value="Punjabi">Punjabi</SelectItem>
								<SelectItem value="Spanish">Spanish</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div>
						<Label>Level</Label>
						<Select
							onValueChange={(
								value: "Beginner" | "Intermediate" | "Advanced"
							) => {
								setFormData((prevData) => ({
									...prevData,
									level: value,
								}));
							}}
							value={formData.level}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select Language" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Beginner">Beginner</SelectItem>
								<SelectItem value="Intermediate">Intermediate</SelectItem>
								<SelectItem value="Advanced">Advanced</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<SubmitButton isLoading={isLoading} loadingText="Creating">
					Create Course
				</SubmitButton>

				{/* Error Message */}
				{error && <p className="text-red-500 mt-2">{error}</p>}
			</form>
		</Section>
	);
};

export default AddCoursePage;
