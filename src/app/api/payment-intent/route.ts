import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Payment from "@/model/payment.model";
import { getAuth } from "@clerk/nextjs/server";
import User from "@/model/user.model";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
	apiVersion: "2024-11-20.acacia", // Use the latest available version
	typescript: true, // Enables TypeScript type definitions
});

export async function POST(req: NextRequest) {
	try {
		await connectDB(); // Connect to your database

		const { courseId, amount } = await req.json();
		const { userId } = getAuth(req);

		if (!userId) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		const user = await User.findOne({ clerkUserId: userId });

		if (!user)
			return NextResponse.json(
				{ message: "user delete from databases" },
				{ status: 401 }
			);

		// Check if the user already has a pending payment
		const existingPayment = await Payment.findOne({
			userId: user._id,
			courseId,
			paymentStatus: "pending",
		});

		if (existingPayment) {
			return NextResponse.json(
				{ message: "Payment already in progress" },
				{ status: 400 }
			);
		}

		// Create a new payment intent
		const paymentIntent = await stripe.paymentIntents.create({
			amount: amount * 100, // Stripe works in the smallest currency unit
			currency: "USD",
			metadata: { userId, courseId },
		});

		// Save payment record in the database
		await Payment.create({
			userId: user._id,
			courseId,
			amount,
			currency: "USD",
			paymentStatus: "pending",
			paymentMethod: "stripe",
			transactionId: paymentIntent.id,
		});

		return NextResponse.json({
			clientSecret: paymentIntent.client_secret,
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: "Payment initiation failed", error: (error as Error).message },
			{ status: 500 }
		);
	}
}
