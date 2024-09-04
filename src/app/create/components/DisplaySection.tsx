import React, { useState } from "react";
import { ISection } from "@/model/course.model"; // Adjust the import path as needed
import UpdateSectionForm from "./UpdateSectionForm";
import { Button } from "@/components/ui/button";
import mongoose from "mongoose";
import Link from "next/link";
import { useParams } from "next/navigation";

interface SectionProps {
	sectionId: mongoose.Types.ObjectId;
	sectionData: ISection;
}

const Section: React.FC<SectionProps> = ({ sectionId, sectionData }) => {
	const { courseId } = useParams();
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [title, setTitle] = useState<string>(sectionData.title);

	const handleToggleEdit = (e: any) => {
		e.preventDefault();
		setIsEditing((prev) => !prev);
	};

	const handleUpdateSuccess = (newTitle: string) => {
		setTitle(newTitle);
	};

	return (
		<Link
			href={`/create/courses/${courseId}/sections/${sectionId}`}
			className="p-4 border rounded-md"
		>
			{!isEditing ? (
				<div className="flex w-full justify-between gap-4 items-center">
					<h2 className="text-lg font-semibold flex-1">{title}</h2>
					<div className="flex gap-4 items-center">
						<h3 className="text-sm">Lessons: {sectionData.lessons.length}</h3>
						<Button onClick={handleToggleEdit}>Edit Section</Button>
					</div>
				</div>
			) : (
				<UpdateSectionForm
					sectionId={sectionId}
					initialTitle={title}
					toggleEditing={handleToggleEdit}
					onUpdateSuccess={handleUpdateSuccess}
				/>
			)}
		</Link>
	);
};

export default Section;
