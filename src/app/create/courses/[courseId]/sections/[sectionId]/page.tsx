import AddLessonForm from "@/app/create/components/AddLessonForm";
import DisplayLesson from "@/app/create/components/DisplayLesson";
import React from "react";

const SectionPage = ({ params }: { params: { sectionId: string } }) => {
	const sectionId = params.sectionId;
	return (
		<div>
			<AddLessonForm />
			<DisplayLesson />
		</div>
	);
};

export default SectionPage;
