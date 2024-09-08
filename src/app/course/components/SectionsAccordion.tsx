import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { formatDuration } from "@/utils/commonFunc";
import { Video } from "lucide-react";
import { useState } from "react";

interface ILesson {
	_id: string;
	title: string;
	content: string;
	videoUrl?: string;
	duration?: number;
	preview?: boolean;
}

export interface ISection {
	_id: string;
	title: string;
	lessons: ILesson[];
}

interface SectionsProps {
	sections: ISection[];
}

export default function SectionsAccordion({ sections }: SectionsProps) {
	const [activeSection, setActiveSection] = useState<string | null>(null);

	return (
		<Accordion type="single" collapsible onValueChange={setActiveSection}>
			{sections.map((section) => (
				<AccordionItem key={section._id} value={section._id}>
					<AccordionTrigger>
						<CardHeader className="w-full">
							<CardTitle className="flex justify-between items-center w-full">
								<div>{section.title}</div>{" "}
								<div className="text-sm">{section.lessons.length} lessons</div>
							</CardTitle>
						</CardHeader>
					</AccordionTrigger>
					<AccordionContent>
						<ul>
							{section.lessons.length > 0 ? (
								section.lessons.map((lesson) => (
									<li
										key={lesson._id}
										className={`px-4 py-2 text-sm border-b border-muted hover:bg-accent hover:shadow-sm transition-all duration-300 ${
											lesson.preview && "cursor-pointer"
										}`}
									>
										<div className="flex flex-col md:flex-row justify-between items-start md:items-center">
											<div className="flex justify-between items-center w-full space-y-1 md:space-y-0">
												<div
													className={`space-x-2 flex items-center  ${
														lesson.preview
															? "underline text-blue-600"
															: "text-foreground"
													}`}
												>
													<Video strokeWidth={"1px"} />
													<p>{lesson.title}</p>
												</div>
												<div className="flex space-x-4 items-center">
													{lesson.preview && (
														<Badge variant="outline" className="mt-3 md:mt-0">
															Preview
														</Badge>
													)}
													{lesson.duration && (
														<p
															className={`text-sm mt-1 ${
																lesson.preview
																	? "underline text-blue-500"
																	: "text-foreground"
															}`}
														>
															{formatDuration(lesson.duration)}
														</p>
													)}
												</div>
											</div>
										</div>
									</li>
								))
							) : (
								<p className="text-muted-foreground px-4 py-2 text-sm border-b border-muted">
									No lessons available.
								</p>
							)}
						</ul>
					</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	);
}
