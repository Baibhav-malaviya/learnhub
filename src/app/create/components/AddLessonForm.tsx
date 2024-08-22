"use client";
import { Input } from "@/components/ui/input";
import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { generateSlug } from "@/utils/commonFunc";
import SubmitButton from "@/components/SubmitButton";

function AddLessonForm() {
	const [title, setTitle] = useState<string>("");
	const [content, setContent] = useState<string>("");
	const [file, setFile] = useState<File | null>(null);
	const [fileSize, setFileSize] = useState<string>("");
	const [isUploading, setIsUploading] = useState(false);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const [isForPreview, setIsForPreview] = useState<boolean>(false);

	const { courseId, sectionId } = useParams();

	const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
		const selectedFile = event.target.files?.[0] || null;
		if (selectedFile) {
			const fileSizeInMB = selectedFile.size / (1024 * 1024);
			if (fileSizeInMB > 500) {
				setUploadError(
					"File size exceeds 500MB limit. Please choose a smaller file or compress the same file."
				);
				setFile(null);
				setFileSize("");
				event.target.value = ""; // Reset the file input
			} else {
				setFile(selectedFile);
				setFileSize(fileSizeInMB.toFixed(2));
				setUploadError(null);
			}
		} else {
			setFile(null);
			setFileSize("");
			setUploadError(null);
		}
	};

	const handleFormSubmit = async (event: FormEvent) => {
		event.preventDefault();

		if (!file) {
			setUploadError("No video file selected");
			return;
		}

		setIsUploading(true);
		setUploadError(null);

		const formData = new FormData();
		formData.append("file", file);
		formData.append("title", title);
		formData.append("content", content);
		formData.append("fileSize", fileSize);
		formData.append("isForPreview", isForPreview.toString());

		try {
			const response = await axios.post(
				`/api/create/courses/${courseId}/sections/${sectionId}/lessons`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			console.log("lesson upload response:", response.data);

			setTitle("");
			setContent("");
			setFile(null);
			setFileSize("");
			setIsForPreview(false);
		} catch (error) {
			console.error("Error uploading lesson:", error);
			setUploadError("Failed to upload lesson. Please try again.");
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<section>
			<div>
				<form onSubmit={handleFormSubmit} className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<Input
								type="text"
								placeholder="Lesson Title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								required
							/>
						</div>
						<div>
							<Input
								type="text"
								name="slug"
								value={generateSlug(title)}
								readOnly
								placeholder="Slug auto-generated from title"
							/>
						</div>
					</div>
					<div>
						<Textarea
							placeholder="Lesson Content"
							value={content}
							onChange={(e) => setContent(e.target.value)}
							required
						/>
					</div>
					<Input
						type="file"
						onChange={handleFileSelect}
						accept="video/*"
						required
					/>
					<div className="flex space-x-2">
						<Checkbox
							id="is-tutor"
							checked={isForPreview}
							onCheckedChange={(checked: boolean) => setIsForPreview(checked)}
						/>
						<div className="grid gap-1.5 leading-none">
							<label
								htmlFor="is-tutor"
								className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>
								Available for Preview
							</label>
							<p className="text-sm text-muted-foreground">
								You can change it later in update section.
							</p>
						</div>
					</div>
					{file && <p>File size: {fileSize} MB</p>}
					{uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}

					<SubmitButton isLoading={isUploading} loadingText="Adding...">
						Add Lesson
					</SubmitButton>
				</form>
			</div>
		</section>
	);
}

export default AddLessonForm;
