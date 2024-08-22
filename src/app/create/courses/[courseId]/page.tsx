"use client";
import { useEffect, useState } from "react";
import { ISection } from "@/model/course.model"; // Adjust the import path as needed
import AddSectionForm from "../../components/AddSectionForm";
import Section from "../../components/DisplaySection";

const CoursePage = ({ params }: { params: { courseId: string } }) => {
	const courseId = params.courseId;
	const [sections, setSections] = useState<ISection[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchCourseData = async () => {
			try {
				const sectionsResponse = await fetch(
					`/api/courses/fetch/sections?courseId=${courseId}`
				);
				if (!sectionsResponse.ok) throw new Error("Failed to fetch sections");

				const sectionsData = await sectionsResponse.json();
				console.log("sectionsData: ", sectionsData.section);
				setSections(sectionsData.sections);
			} catch (error) {
				setError("Failed to load data");
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchCourseData();
	}, [courseId]);

	const handleNewSection = (newSection: ISection) => {
		setSections((prevSections) => [...prevSections, newSection]);
	};

	if (loading) return <div>Loading...</div>;
	if (error) return <div>{error}</div>;

	return (
		<div>
			<h1 className="text-2xl font-bold mb-4">Course Details</h1>
			<AddSectionForm courseId={courseId} onSectionAdded={handleNewSection} />
			<div className="mt-8 flex flex-col gap-4">
				{sections.length > 0 ? (
					sections.map((section, idx) => (
						<Section key={idx} sectionId={section._id} sectionData={section} />
					))
				) : (
					<p>No sections available.</p>
				)}
			</div>
		</div>
	);
};

export default CoursePage;
