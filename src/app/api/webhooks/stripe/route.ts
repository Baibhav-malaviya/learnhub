import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Payment from "@/model/payment.model";
import { enrollUserInCourse } from "@/lib/routeFunction";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2024-11-20.acacia",
});

// Validate environment variables
function validateEnvironment() {
	const requiredEnvVars = ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"];
	for (const envVar of requiredEnvVars) {
		if (!process.env[envVar]) {
			const errorMessage = `Missing required environment variable: ${envVar}`;
			console.error(errorMessage);
			throw new Error(errorMessage);
		}
		console.log(`${envVar}: ${process.env[envVar]}`);
	}
}

// Centralized error logger
function logError(context: string, error: unknown) {
	console.error(
		`[Stripe Webhook Error - ${context}]`,
		error instanceof Error ? error.message : error
	);
}

export async function POST(req: NextRequest) {
	console.log("Stripe Webhook Triggered");
	try {
		validateEnvironment();
		await connectDB();

		const signature = req.headers.get("stripe-signature");
		if (!signature) {
			return NextResponse.json(
				{ message: "Missing Stripe signature" },
				{ status: 400 }
			);
		}

		const rawBody = await req.text();
		let event: Stripe.Event;

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

		const { type, data } = event;
		const paymentIntent = data.object as Stripe.PaymentIntent;

		switch (type) {
			case "payment_intent.succeeded":
				await handleSuccessfulPayment(paymentIntent);
				break;

			case "payment_intent.payment_failed":
				await handleFailedPayment(paymentIntent);
				break;

			case "charge.succeeded":
				await handleChargeSucceeded(data.object as Stripe.Charge);
				break;

			case "charge.failed":
				await handleChargeFailed(data.object as Stripe.Charge);
				break;

			case "charge.refunded":
				await handleChargeRefunded(data.object as Stripe.Charge);
				break;

			case "payment_intent.requires_action":
				console.log("Payment intent requires action:", paymentIntent);
				break;

			case "payment_intent.created":
				console.log("payment_intent.created", paymentIntent);
				break;

			case "charge.updated":
				console.log("charge.updated:", paymentIntent);
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

// Handlers for various events
async function handleSuccessfulPayment(paymentIntent: Stripe.PaymentIntent) {
	try {
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

		await Payment.findOneAndUpdate(
			{ transactionId: paymentIntent.id },
			{
				paymentStatus: "succeeded",
				paidAt: new Date(),
				amount: paymentIntent.amount / 100,
			}
		);

		const enrollmentResult = await enrollUserInCourse(
			payment.userId,
			payment.courseId
		);

		if (!enrollmentResult.success) {
			logError("Course Enrollment", enrollmentResult.message);
		}
		console.log("payment succeeded:", paymentIntent);
	} catch (err) {
		logError("Successful Payment Processing", err);
	}
}

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
		console.log("payment failed:", paymentIntent);
	} catch (err) {
		logError("Failed Payment Processing", err);
	}
}

async function handleChargeSucceeded(charge: Stripe.Charge) {
	try {
		console.log("Charge succeeded:", charge);
		// Add specific logic for charge success, if applicable
	} catch (err) {
		logError("Charge Succeeded Processing", err);
	}
}

async function handleChargeFailed(charge: Stripe.Charge) {
	try {
		console.log("Charge failed:", charge);
		// Add specific logic for charge failure
	} catch (err) {
		logError("Charge Failed Processing", err);
	}
}

async function handleChargeRefunded(charge: Stripe.Charge) {
	try {
		console.log("Charge refunded:", charge);
		// Add specific logic for refund handling
	} catch (err) {
		logError("Charge Refunded Processing", err);
	}
}
