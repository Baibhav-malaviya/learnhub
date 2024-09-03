"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/hooks/use-toast";
import { generateSlug } from "@/utils/commonFunc";
import SubmitButton from "@/components/SubmitButton";
import { ISection } from "@/model/course.model";

interface AddSectionFormProps {
	courseId: string;
	onSectionAdded: (newSection: ISection) => void;
}

const AddSectionForm = ({ courseId, onSectionAdded }: AddSectionFormProps) => {
	const [title, setTitle] = useState("");
	const [slug, setSlug] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const { toast } = useToast();

	useEffect(() => {
		setSlug(generateSlug(title));
	}, [title]);

	const handleAddSection = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const response = await axios.post(
				`/api/create/courses/${courseId}/sections`,
				{
					title,
				}
			);

			console.log("Response: ", response);
			const newSection: ISection = response.data.section;
			onSectionAdded(newSection);
			setSuccess(true);
			setTitle(""); // Reset form
			setSlug(""); // Reset slug
			toast({
				title: "Section added successfully!",
				description: `Section "${title}" has been added.`,
			});
		} catch (err) {
			setError("Failed to add section");
			toast({
				variant: "destructive",
				title: "Error",
				description: "Failed to add section. Please try again.",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleAddSection} className="space-y-4">
			<div className="flex gap-4">
				<div className="flex-1">
					<Label htmlFor="title">Section Title:</Label>
					<Input
						type="text"
						id="title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
					/>
				</div>
				<div className="flex-1">
					<Label htmlFor="slug">Slug:</Label>
					<Input
						type="text"
						id="slug"
						value={slug}
						readOnly
						placeholder="Slug auto-generated from title"
					/>
				</div>
			</div>

			<SubmitButton isLoading={loading} loadingText="Adding...">
				Add Section
			</SubmitButton>
			{success && !loading && (
				<p className="text-green-500">Section added successfully!</p>
			)}
			{error && !loading && <p className="text-red-500">{error}</p>}
		</form>
	);
};

export default AddSectionForm;
