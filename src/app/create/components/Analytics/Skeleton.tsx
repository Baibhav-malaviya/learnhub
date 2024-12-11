import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AnalyticsSkeleton() {
	return (
		<div className="container mx-auto p-4">
			<div className="flex justify-between items-center mb-6">
				<Skeleton className="h-9 w-48" />
				<div className="flex space-x-4">
					<Skeleton className="h-10 w-[150px]" />
					<Skeleton className="h-10 w-[200px]" />
					<Skeleton className="h-10 w-[200px]" />
				</div>
			</div>

			<div className="mb-6">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle>
							<Skeleton className="h-6 w-64" />
						</CardTitle>
					</CardHeader>
					<CardContent>
						<Skeleton className="h-9 w-32" />
					</CardContent>
				</Card>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
				{[...Array(4)].map((_, i) => (
					<Card key={i}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle>
								<Skeleton className="h-5 w-32" />
							</CardTitle>
						</CardHeader>
						<CardContent>
							<Skeleton className="h-8 w-24" />
						</CardContent>
					</Card>
				))}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{[...Array(4)].map((_, i) => (
					<Card key={i}>
						<CardHeader>
							<CardTitle>
								<Skeleton className="h-6 w-48" />
							</CardTitle>
						</CardHeader>
						<CardContent>
							<Skeleton className="h-[300px] w-full" />
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
