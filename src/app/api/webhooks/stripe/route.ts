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
				// Find the payment record
				const payment = await Payment.findOne({
					transactionId: paymentIntent.id,
				});

				if (payment) {
					// Update payment status
					await Payment.findOneAndUpdate(
						{ transactionId: paymentIntent.id },
						{ paymentStatus: "succeeded" }
					);

					// Enroll user in the course
					const enrollmentResult = await enrollUserInCourse(
						payment.userId, // Assuming you store Clerk user ID in the payment record
						payment.courseId // Assuming you store course ID in the payment record
					);

					if (!enrollmentResult.success) {
						console.error("Enrollment failed:", enrollmentResult.message);
						// Optionally, you might want to handle enrollment failures
						// Perhaps by updating the payment status or logging
					}
				}
				break;

			case "payment_intent.payment_failed":
				await Payment.findOneAndUpdate(
					{ transactionId: paymentIntent.id },
					{
						paymentStatus: "failed",
						failureReason: paymentIntent.last_payment_error?.message,
					}
				);
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
