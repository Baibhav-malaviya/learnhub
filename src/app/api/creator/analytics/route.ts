// app/api/creator/analytics/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import Course from "@/model/course.model";
import Payment from "@/model/payment.model";
import User from "@/model/user.model";

export async function GET(request: NextRequest) {
	try {
		const { userId } = getAuth(request);

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Find the user to get their created courses
		const user = await User.findOne({ clerkUserId: userId });

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// Get courses created by the user
		const courses = await Course.find({ creatorId: user._id });
		// console.log("courses: ", courses);

		// Aggregate payments for these courses
		const courseAnalytics = await Promise.all(
			courses.map(async (course) => {
				// Monthly data aggregation
				const monthlyPayments = await Payment.aggregate([
					{
						$match: {
							courseId: course._id,
							paymentStatus: "succeeded",
						},
					},
					{
						$group: {
							_id: { $dateToString: { format: "%b", date: "$createdAt" } },
							enrollments: { $sum: 1 },
							revenue: { $sum: "$amount" },
							payments: { $sum: 1 },
						},
					},
					{ $sort: { _id: 1 } },
				]);

				// Rating data (using course's reviews)
				const ratingData = course.reviews.map((review, index) => ({
					month: new Date(course.createdAt).toLocaleString("default", {
						month: "short",
					}),
					rating: review.rating,
				}));

				return {
					courseId: course._id,
					courseTitle: course.title,
					totalEnrollments: course.enrollmentCount,
					totalRevenue: monthlyPayments.reduce(
						(sum, payment) => sum + payment.revenue,
						0
					),
					totalPayments: monthlyPayments.reduce(
						(sum, payment) => sum + payment.payments,
						0
					),
					averagePrice: course.price,
					studentsCompleted: course.studentsCompleted,
					averageRating: course.averageRating,
					monthlyData: monthlyPayments.map((payment) => ({
						month: payment._id,
						enrollments: payment.enrollments,
						revenue: payment.revenue,
						payments: payment.payments,
					})),
					ratingData: ratingData,
				};
			})
		);

		return NextResponse.json(courseAnalytics);
	} catch (error) {
		console.error("Analytics Fetch Error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch analytics" },
			{ status: 500 }
		);
	}
}
