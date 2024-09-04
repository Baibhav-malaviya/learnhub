import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useToast } from "@/components/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SubmitButton from "@/components/SubmitButton";
import { Switch } from "@/components/ui/switch";
import { ILesson } from "@/model/course.model";

interface LessonUpdateFormProps {
	courseId: string;
	sectionId: string;
	lesson: ILesson;
	onUpdateLesson: (updatedLesson: ILesson) => void;
}

const UpdateLessonForm: React.FC<LessonUpdateFormProps> = ({
	courseId,
	sectionId,
	lesson,
	onUpdateLesson,
}) => {
	const [title, setTitle] = useState(lesson.title);
	const [content, setContent] = useState(lesson.content);
	const [videoUrl, setVideoUrl] = useState(lesson.videoUrl || "");
	const [preview, setPreview] = useState(lesson.preview || false);
	const [isLoading, setIsLoading] = useState(false);

	const { toast } = useToast();
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		const updateData = {
			title,
			content,
			videoUrl,
			preview,
		};

		try {
			const res = await axios.put(
				`/api/create/courses/${courseId}/sections/${sectionId}/lessons/${lesson._id}`,
				updateData,
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			if (res.status === 200) {
				// Successfully updated
				const updatedLesson = res.data.lesson;
				onUpdateLesson(updatedLesson);
				toast({ title: "Lesson updated successfully!" });
			} else {
				console.error("Failed to update lesson:", res.data);
			}
		} catch (error) {
			console.error("Error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4 px-2">
			<div>
				<Label htmlFor="title">Title</Label>
				<Input
					id="title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					required
				/>
			</div>

			<div>
				<Label htmlFor="content">Content</Label>
				<Textarea
					id="content"
					value={content}
					onChange={(e) => setContent(e.target.value)}
					required
				/>
			</div>

			<div>
				<Label htmlFor="videoUrl">Video URL</Label>
				<Input
					id="videoUrl"
					type="url"
					value={videoUrl}
					readOnly
					onChange={(e) => setVideoUrl(e.target.value)}
				/>
			</div>

			<div className="flex items-center space-x-3">
				<Label htmlFor="preview">Preview</Label>
				<Switch
					id="preview"
					checked={preview}
					onCheckedChange={(checked) => setPreview(checked)}
				/>
			</div>

			<SubmitButton isLoading={isLoading} loadingText="Updating...">
				Update Lesson
			</SubmitButton>
		</form>
	);
};

export default UpdateLessonForm;
