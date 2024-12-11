import { FileQuestion } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export function EmptyState() {
	return (
		<div className="container mx-auto p-4">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<FileQuestion className="h-6 w-6" />
						No Analytics Data
					</CardTitle>
					<CardDescription>
						There is no analytics data available at the moment.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p>This could be because:</p>
					<ul className="list-disc pl-6 mt-2">
						<li>No courses have been created yet</li>
						<li>No students have enrolled in any courses</li>
						<li>The data is still being processed</li>
					</ul>
					<p className="mt-4">
						Please check back later or contact support if you believe this is an
						error.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
