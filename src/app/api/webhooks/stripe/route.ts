import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Payment from "@/model/payment.model";
import { enrollUserInCourse } from "@/lib/routeFunction";

// Stripe initialization with improved typing
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2024-11-20.acacia",
});

// Environment variables validation
function validateEnvironment() {
	const requiredEnvVars = ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"];

	for (const envVar of requiredEnvVars) {
		if (!process.env[envVar]) {
			const errorMessage = `Missing required environment variable: ${envVar}`;
			console.error(errorMessage);
			throw new Error(errorMessage);
		}
	}
}

// Centralized error logging
function logError(context: string, error: unknown) {
	console.error(
		`[Stripe Webhook Error - ${context}]`,
		error instanceof Error ? error.message : error
	);
}

export async function POST(req: NextRequest) {
	try {
		// Validate environment at the start of each request
		validateEnvironment();

		// Ensure database connection
		await connectDB();

		// Extract signature and raw body
		const signature = req.headers.get("stripe-signature");
		if (!signature) {
			return NextResponse.json(
				{ message: "Missing Stripe signature" },
				{ status: 400 }
			);
		}

		const rawBody = await req.text();
		let event: Stripe.Event;

		// Verify webhook signature
		try {
			event = stripe.webhooks.constructEvent(
				rawBody,
				signature,
				process.env.STRIPE_WEBHOOK_SECRET!
			);
		} catch (err) {
			logError("Signature Verification", err);
			return NextResponse.json(
				{ message: "Invalid webhook signature" },
				{ status: 400 }
			);
		}

		// Extract payment intent and event type
		const { type, data } = event;
		const paymentIntent = data.object as Stripe.PaymentIntent;

		// Handle different event types
		switch (type) {
			case "payment_intent.succeeded":
				await handleSuccessfulPayment(paymentIntent);
				break;

			case "payment_intent.payment_failed":
				await handleFailedPayment(paymentIntent);
				break;

			default:
				console.log(`Unhandled event type: ${type}`);
		}

		return NextResponse.json(
			{ message: "Webhook processed successfully" },
			{ status: 200 }
		);
	} catch (err) {
		logError("Webhook Processing", err);
		return NextResponse.json(
			{ message: "Internal webhook processing error" },
			{ status: 500 }
		);
	}
}

// Dedicated handler for successful payments
async function handleSuccessfulPayment(paymentIntent: Stripe.PaymentIntent) {
	try {
		// Find the corresponding payment record
		const payment = await Payment.findOne({
			transactionId: paymentIntent.id,
		});

		if (!payment) {
			logError(
				"Payment Record Not Found",
				`Transaction ID: ${paymentIntent.id}`
			);
			return;
		}

		// Update payment status
		await Payment.findOneAndUpdate(
			{ transactionId: paymentIntent.id },
			{
				paymentStatus: "succeeded",
				paidAt: new Date(),
				amount: paymentIntent.amount / 100, // Convert cents to dollars
			}
		);

		// Attempt to enroll user in course
		const enrollmentResult = await enrollUserInCourse(
			payment.userId,
			payment.courseId
		);

		if (!enrollmentResult.success) {
			logError("Course Enrollment", enrollmentResult.message);
		}

		// Optional: Send confirmation email or trigger additional notifications
		// await sendConfirmationEmail(payment.userId, payment.courseId);
	} catch (err) {
		logError("Successful Payment Processing", err);
	}
}

// Dedicated handler for failed payments
async function handleFailedPayment(paymentIntent: Stripe.PaymentIntent) {
	try {
		await Payment.findOneAndUpdate(
			{ transactionId: paymentIntent.id },
			{
				paymentStatus: "failed",
				failureReason:
					paymentIntent.last_payment_error?.message ||
					"Unknown payment failure",
				failedAt: new Date(),
			}
		);

		// Optional: Notify user about payment failure
		// await sendPaymentFailureNotification(payment.userId);
	} catch (err) {
		logError("Failed Payment Processing", err);
	}
}
