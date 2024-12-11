import { FileQuestion } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export function CourseEmptyState() {
	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-primary">
					<FileQuestion className="h-6 w-6" />
					No Courses Found
				</CardTitle>
				<CardDescription>
					We couldn&apos;t find any courses matching your criteria.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<p className="text-muted-foreground">This could be because:</p>
				<ul className="list-disc pl-6 mt-2 text-muted-foreground">
					<li>No courses have been added yet</li>
					<li>Your search filters are too restrictive</li>
					<li>There might be a temporary issue with our course database</li>
				</ul>
				<p className="mt-4 text-muted-foreground">
					Try adjusting your search or check back later for new courses.
				</p>
			</CardContent>
		</Card>
	);
}
