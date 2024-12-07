// /app/course/[courseId]/payment/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/hooks/use-toast";

// Set your Stripe public key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const PaymentPage = ({ params }: { params: { id: string } }) => {
	const router = useRouter();
	const toast = useToast();
	const { id: courseId } = params; // Extract courseId from dynamic route params
	const [clientSecret, setClientSecret] = useState<string | null>(null);

	useEffect(() => {
		const queryParams = new URLSearchParams(window.location.search);
		const clientSecretFromUrl = queryParams.get("clientSecret");

		if (clientSecretFromUrl) {
			setClientSecret(clientSecretFromUrl);
		} else {
			// toast.error("Missing clientSecret in the URL");
			router.push("/"); // Redirect to homepage if clientSecret is missing
		}
	}, [router, toast]);

	const handlePayment = async () => {
		if (!clientSecret) return;

		const stripe = await stripePromise;
		if (!stripe) return;

		// Confirm the payment using Stripe's confirmCardPayment method
		const { error, paymentIntent } = await stripe.confirmCardPayment(
			clientSecret
		);

		if (error) {
			// toast.error(`Payment failed: ${error.message}`);
		} else {
			if (paymentIntent?.status === "succeeded") {
				// toast.success("Payment successful! You are now enrolled.");
				router.push(`/course/${courseId}`); // Redirect to course page or any other page
			} else {
				// toast.error("Payment failed. Please try again.");
			}
		}
	};

	return (
		<div className="payment-container">
			<h2>Complete Your Payment</h2>
			<p>
				You are about to pay for course {courseId}. Please confirm your payment
				details.
			</p>

			<div className="payment-details">
				{/* Custom payment form can be added here */}
				<Button onClick={handlePayment}>Complete Payment</Button>
			</div>
		</div>
	);
};

export default PaymentPage;
