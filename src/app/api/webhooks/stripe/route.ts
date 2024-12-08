import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Payment from "@/model/payment.model";
import { enrollUserInCourse } from "@/lib/routeFunction";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
	apiVersion: "2024-11-20.acacia",
});

export async function POST(req: NextRequest) {
	try {
		if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
			throw new Error("Stripe environment variables are not set.");
		}

		await connectDB(); // Connect to your database

		const sig = req.headers.get("stripe-signature")!;
		const rawBody = await req.text(); // Get raw request body for signature validation

		let event: Stripe.Event;
		try {
			event = stripe.webhooks.constructEvent(
				rawBody,
				sig,
				process.env.STRIPE_WEBHOOK_SECRET!
			);
		} catch (err) {
			console.error("Webhook signature verification failed:", err);
			return NextResponse.json(
				{ message: "Invalid signature" },
				{ status: 400 }
			);
		}

		const { type, data } = event;
		const paymentIntent = data.object as Stripe.PaymentIntent;

		switch (type) {
			case "payment_intent.succeeded":
				try {
					const payment = await Payment.findOne({
						transactionId: paymentIntent.id,
					});

					if (!payment) {
						console.warn(
							`Payment record not found for transaction ID: ${paymentIntent.id}`
						);
						break;
					}

					await Payment.findOneAndUpdate(
						{ transactionId: paymentIntent.id },
						{ paymentStatus: "succeeded" }
					);

					const enrollmentResult = await enrollUserInCourse(
						payment.userId,
						payment.courseId
					);

					if (!enrollmentResult.success) {
						console.error("Enrollment failed:", enrollmentResult.message);
					}
				} catch (err) {
					console.error("Error processing payment_intent.succeeded:", err);
				}
				break;

			case "payment_intent.payment_failed":
				try {
					await Payment.findOneAndUpdate(
						{ transactionId: paymentIntent.id },
						{
							paymentStatus: "failed",
							failureReason: paymentIntent.last_payment_error?.message,
						}
					);
				} catch (err) {
					console.error("Error processing payment_intent.payment_failed:", err);
				}
				break;

			default:
				console.log(`Unhandled event type: ${type}`);
		}

		return NextResponse.json({ message: "Webhook handled" }, { status: 200 });
	} catch (err) {
		console.error("Webhook handling error:", err);
		return NextResponse.json({ message: "Webhook error" }, { status: 500 });
	}
}
