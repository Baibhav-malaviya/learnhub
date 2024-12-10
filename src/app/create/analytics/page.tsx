"use client";

import {
	Bar,
	BarChart,
	Line,
	LineChart,
	Pie,
	PieChart,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	LabelList,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState, useRef } from "react";

interface MonthlyData {
	month: string;
	enrollments: number;
	revenue: number;
	payments: number;
}

interface RatingData {
	month: string;
	rating: number;
}

interface CourseAnalytics {
	courseId: string;
	courseTitle: string;
	totalEnrollments: number;
	totalRevenue: number;
	totalPayments: number;
	averagePrice: number;
	studentsCompleted: number;
	averageRating: number;
	monthlyData: MonthlyData[];
	ratingData: RatingData[];
}

// Months array for filtering
const MONTHS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

export default function CourseAnalyticsPage() {
	const [analytics, setAnalytics] = useState<CourseAnalytics[] | null>(null);
	const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
	const [selectedMonths, setSelectedMonths] = useState<string[]>(MONTHS);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [totalRevenue, setTotalRevenue] = useState(0);
	const [viewMode, setViewMode] = useState<"single" | "all">("all");

	useEffect(() => {
		async function fetchAnalytics() {
			try {
				const response = await fetch("/api/creator/analytics");
				const data = await response.json();

				if (response.ok) {
					setAnalytics(data);
					// Set first course as default if exists
					if (data.length > 0) {
						setSelectedCourse(data[0].courseId);

						// Calculate total revenue across all courses
						const totalRev = data.reduce(
							(sum: number, course: CourseAnalytics) =>
								sum + course.totalRevenue,
							0
						);
						setTotalRevenue(totalRev);
					}
				} else {
					setError("Failed to fetch analytics");
				}
				setLoading(false);
			} catch (error) {
				console.error("Error fetching analytics:", error);
				setError("Error fetching analytics");
				setLoading(false);
			}
		}

		fetchAnalytics();
	}, []);

	// Aggregate data for all courses
	const aggregatedData = analytics
		? {
				totalEnrollments: analytics.reduce(
					(sum, course) => sum + course.totalEnrollments,
					0
				),
				totalRevenue: analytics.reduce(
					(sum, course) => sum + course.totalRevenue,
					0
				),
				averagePrice: Number(
					(
						analytics.reduce((sum, course) => sum + course.averagePrice, 0) /
						analytics.length
					).toFixed(2)
				),
				averageRating: Number(
					(
						analytics.reduce((sum, course) => sum + course.averageRating, 0) /
						analytics.length
					).toFixed(1)
				),
				studentsCompleted: analytics.reduce(
					(sum, course) => sum + course.studentsCompleted,
					0
				),
				totalEnrollmentsCount: analytics.reduce(
					(sum, course) => sum + course.totalEnrollments,
					0
				),
				monthlyData: MONTHS.map((month) => ({
					month,
					enrollments: analytics.reduce(
						(sum, course) =>
							sum +
							(course.monthlyData.find((data) => data.month === month)
								?.enrollments || 0),
						0
					),
					revenue: analytics.reduce(
						(sum, course) =>
							sum +
							(course.monthlyData.find((data) => data.month === month)
								?.revenue || 0),
						0
					),
					payments: analytics.reduce(
						(sum, course) =>
							sum +
							(course.monthlyData.find((data) => data.month === month)
								?.payments || 0),
						0
					),
				})),
				ratingData: MONTHS.map((month) => ({
					month,
					rating: Number(
						(
							analytics.reduce(
								(sum, course) =>
									sum +
									(course.ratingData.find((data) => data.month === month)
										?.rating || 0),
								0
							) /
								analytics.filter((course) =>
									course.ratingData.some((data) => data.month === month)
								).length || 0
						).toFixed(1)
					),
				})),
		  }
		: null;

	// Get selected course analytics
	const currentCourseAnalytics =
		viewMode === "single"
			? analytics?.find((course) => course.courseId === selectedCourse)
			: aggregatedData;

	// Filter monthly data based on selected months
	const filteredMonthlyData = MONTHS.map((month) => {
		const monthData = currentCourseAnalytics?.monthlyData.find(
			(data) => data.month === month
		);
		return {
			month,
			enrollments: monthData?.enrollments || 0,
			revenue: monthData?.revenue || 0,
			payments: monthData?.payments || 0,
		};
	}).filter((data) => selectedMonths.includes(data.month));

	const filteredRatingData = MONTHS.map((month) => {
		const ratingData = currentCourseAnalytics?.ratingData.find(
			(data) => data.month === month
		);
		return {
			month,
			rating: ratingData?.rating || 0,
		};
	}).filter((data) => selectedMonths.includes(data.month));

	if (loading) return <div>Loading analytics...</div>;
	if (error) return <div>Error: {error}</div>;
	if (!analytics || analytics.length === 0)
		return <div>No analytics data available</div>;

	const completionRate = currentCourseAnalytics
		? (currentCourseAnalytics.studentsCompleted /
				currentCourseAnalytics.totalEnrollments) *
		  100
		: 0;
	const incompleteRate = 100 - completionRate;

	return (
		<div className="container mx-auto p-4">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Course Analytics</h1>
				<div className="flex space-x-4">
					{/* View Mode Selector */}
					<Select
						value={viewMode}
						onValueChange={(value: "single" | "all") => {
							setViewMode(value);
							// Reset course selection when switching to 'all'
							if (value === "all") {
								setSelectedCourse(null);
							} else if (analytics && analytics.length > 0) {
								setSelectedCourse(analytics[0].courseId);
							}
						}}
					>
						<SelectTrigger className="w-[150px]">
							<SelectValue placeholder="View Mode" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="single">Single Course</SelectItem>
							<SelectItem value="all">All Courses</SelectItem>
						</SelectContent>
					</Select>

					{/* Course Selector (only for single course view) */}
					{viewMode === "single" && (
						<Select
							value={selectedCourse || undefined}
							onValueChange={setSelectedCourse}
						>
							<SelectTrigger className="w-[200px]">
								<SelectValue placeholder="Select Course" />
							</SelectTrigger>
							<SelectContent>
								{analytics.map((course) => (
									<SelectItem key={course.courseId} value={course.courseId}>
										{course.courseTitle}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}

					{/* Month Selector */}
					<MonthSelector
						selectedMonths={selectedMonths}
						onMonthsChange={setSelectedMonths}
					/>
				</div>
			</div>

			{/* Total Revenue Card */}
			<div className="mb-6">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle>
							{viewMode === "single"
								? "Total Revenue Across All Courses"
								: "Total Revenue of All Courses"}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">
							${totalRevenue.toLocaleString()}
						</div>
					</CardContent>
				</Card>
			</div>

			{currentCourseAnalytics && (
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Total Enrollments
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{currentCourseAnalytics.totalEnrollments}
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Total Revenue
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									${currentCourseAnalytics.totalRevenue.toLocaleString()}
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Average Price
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									${currentCourseAnalytics.averagePrice.toFixed(2)}
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Average Rating
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{currentCourseAnalytics.averageRating.toFixed(1)}
								</div>
							</CardContent>
						</Card>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						<Card>
							<CardHeader>
								<CardTitle>
									{viewMode === "single"
										? "Monthly Enrollments"
										: "Total Enrollments by Month"}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ChartContainer
									config={{
										enrollments: {
											label: "Enrollments",
											color: "hsl(var(--chart-1))",
										},
									}}
									className="h-[300px]"
								>
									<BarChart data={filteredMonthlyData}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis
											dataKey="month"
											interval={0}
											angle={-45}
											textAnchor="end"
											height={50}
										/>
										<YAxis allowDecimals={false} domain={[0, "auto"]} />
										<Tooltip content={<ChartTooltipContent />} />
										<Legend />
										<Bar
											dataKey="enrollments"
											fill="var(--color-enrollments)"
											radius={[4, 4, 0, 0]}
										>
											<LabelList dataKey="enrollments" position="top" />
										</Bar>
									</BarChart>
								</ChartContainer>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>
									{viewMode === "single"
										? "Monthly Revenue"
										: "Total Revenue by Month"}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ChartContainer
									config={{
										revenue: {
											label: "Revenue",
											color: "hsl(var(--chart-2))",
										},
									}}
									className="h-[300px]"
								>
									<BarChart data={filteredMonthlyData}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis
											dataKey="month"
											interval={0}
											angle={-45}
											textAnchor="end"
											height={50}
										/>
										<YAxis allowDecimals={false} domain={[0, "auto"]} />
										<Tooltip content={<ChartTooltipContent />} />
										<Legend />
										<Bar
											dataKey="revenue"
											fill="var(--color-revenue)"
											radius={[4, 4, 0, 0]}
										>
											<LabelList
												dataKey="revenue"
												position="top"
												formatter={(value: any) => `$${value}`}
											/>
										</Bar>
									</BarChart>
								</ChartContainer>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>
									{viewMode === "single"
										? "Course Completion Rate"
										: "Overall Completion Rate"}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ChartContainer
									config={{
										completed: {
											label: "Completed",
											color: "hsl(var(--chart-3))",
										},
										incomplete: {
											label: "Incomplete",
											color: "hsl(var(--chart-4))",
										},
									}}
									className="h-[300px]"
								>
									<PieChart>
										<Pie
											data={[
												{ name: "Completed", value: completionRate },
												{ name: "Incomplete", value: incompleteRate },
											]}
											dataKey="value"
											nameKey="name"
											cx="50%"
											cy="50%"
											outerRadius={80}
											label={({ name, percent }) =>
												`${name} ${(percent * 100).toFixed(0)}%`
											}
										>
											<Cell fill="var(--color-completed)" />
											<Cell fill="var(--color-incomplete)" />
										</Pie>
										<Tooltip content={<ChartTooltipContent />} />
										<Legend />
									</PieChart>
								</ChartContainer>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>
									{viewMode === "single"
										? "Average Rating Trend"
										: "Average Ratings by Month"}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ChartContainer
									config={{
										rating: {
											label: "Rating",
											color: "hsl(var(--chart-5))",
										},
									}}
									className="h-[300px]"
								>
									<LineChart data={filteredRatingData}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="month" />
										<YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} />
										<Tooltip content={<ChartTooltipContent />} />
										<Legend />
										<Line
											type="monotone"
											dataKey="rating"
											stroke="var(--color-rating)"
										>
											<LabelList dataKey="rating" position="top" />
										</Line>
									</LineChart>
								</ChartContainer>
							</CardContent>
						</Card>
					</div>
				</>
			)}
		</div>
	);
}

// Custom Month Selector Component
function MonthSelector({
	selectedMonths,
	onMonthsChange,
}: {
	selectedMonths: string[];
	onMonthsChange: (months: string[]) => void;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// Toggle month selection
	const toggleMonth = (month: string) => {
		const newSelectedMonths = selectedMonths.includes(month)
			? selectedMonths.filter((m) => m !== month)
			: [...selectedMonths, month];
		onMonthsChange(newSelectedMonths);
	};

	// Select all or none
	const toggleAllMonths = () => {
		onMonthsChange(selectedMonths.length === MONTHS.length ? [] : [...MONTHS]);
	};

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				className="w-[200px] flex items-center justify-between px-3 py-2 text-sm border rounded-md bg-background"
				onClick={() => setIsOpen(!isOpen)}
			>
				<span>
					{selectedMonths.length === MONTHS.length
						? "All Months"
						: selectedMonths.length > 0
						? `${selectedMonths.length} Months`
						: "Select Months"}
				</span>
				<span className="ml-2">▼</span>
			</button>
			{isOpen && (
				<div className="absolute z-10 w-[200px] mt-1 bg-background border rounded-md shadow-lg">
					<div
						className="px-3 py-2 cursor-pointer hover:bg-accent"
						onClick={toggleAllMonths}
					>
						{selectedMonths.length === MONTHS.length
							? "Deselect All"
							: "Select All"}
					</div>
					{MONTHS.map((month) => (
						<div
							key={month}
							className="px-3 py-2 cursor-pointer hover:bg-accent"
							onClick={() => toggleMonth(month)}
						>
							<input
								type="checkbox"
								checked={selectedMonths.includes(month)}
								onChange={() => {}}
								className="mr-2"
							/>
							{month}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
