import React, { useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SubmitButton from "@/components/SubmitButton";
import mongoose from "mongoose";

interface UpdateSectionFormProps {
	sectionId: mongoose.Types.ObjectId;
	initialTitle: string;
	toggleEditing: (e: any) => void;
	onUpdateSuccess: (newTitle: string) => void;
}

const UpdateSectionForm: React.FC<UpdateSectionFormProps> = ({
	sectionId,
	initialTitle,
	toggleEditing,
	onUpdateSuccess,
}) => {
	const [title, setTitle] = useState<string>(initialTitle);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const params = useParams();
	const courseId = params.courseId as string;

	const handleUpdateSection = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			const response = await axios.put(
				`/api/create/courses/${courseId}/sections/${sectionId}`,
				{ title }
			);

			if (response.status === 200) {
				onUpdateSuccess(title);
				toggleEditing(e);
			} else {
				throw new Error("Failed to update section");
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				setError(error.response?.data?.message || "Failed to update section");
			} else {
				setError("An unexpected error occurred");
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form
			onSubmit={handleUpdateSection}
			className="flex w-full justify-between gap-4"
		>
			<div className="flex-1">
				<Input
					type="text"
					id={`title-${sectionId}`}
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					required
					placeholder="Enter section title"
				/>
			</div>

			<div className="flex gap-4">
				<SubmitButton isLoading={isLoading} loadingText="Updating...">
					Update
				</SubmitButton>
				<Button type="button" variant="outline" onClick={toggleEditing}>
					Cancel
				</Button>
			</div>
			{error && <p className="text-red-500 mt-2">{error}</p>}
		</form>
	);
};

export default UpdateSectionForm;
