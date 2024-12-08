"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
	Elements,
	CardElement,
	useStripe,
	useElements,
} from "@stripe/react-stripe-js";
import { useToast } from "@/components/hooks/use-toast";
import { Loader } from "lucide-react";
import SubmitButton from "@/components/SubmitButton";

// Set your Stripe public key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const PaymentForm = ({
	clientSecret,
	courseId,
}: {
	clientSecret: string;
	courseId: string;
}) => {
	const router = useRouter();
	const { toast } = useToast();
	const stripe = useStripe();
	const elements = useElements();
	const [isLoading, setIsLoading] = useState(false);

	const handlePayment = async (e: any) => {
		e.preventDefault();
		if (!stripe || !elements || !clientSecret) return;

		const cardElement = elements.getElement(CardElement);
		if (!cardElement) return;
		setIsLoading(true);

		try {
			const { error, paymentIntent } = await stripe.confirmCardPayment(
				clientSecret,
				{
					payment_method: {
						card: cardElement, // Use CardElement for card payment methods
					},
					// confirmParams: {
					//   return_url: `${window.location.origin}/course/${courseId}`, // Redirect to the course page upon successful payment
					// },
				}
			);

			console.log("paymentIntent: ", paymentIntent);

			if (error) {
				toast({
					description: `Payment failed: ${error.message}`,
				});
			} else if (paymentIntent?.status === "succeeded") {
				toast({
					description: "Payment successful! You are now enrolled.",
				});
				router.push(`/course/${courseId}`); // Redirect to course page or any other page
			} else {
				toast({
					description: "Payment failed. Please try again",
				});
			}
		} catch (err) {
			toast({
				description: "An error occurred while processing the payment.",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handlePayment}>
			<h3 className="text-lg font-semibold mb-4">Enter Your Card Details</h3>
			<div className="mb-6">
				<CardElement
					options={{
						style: {
							base: {
								fontSize: "16px",
								color: "#333",
								padding: "12px 16px",
								// border: "1px solid #ccc",
								// borderRadius: "4px",
								backgroundColor: "#fff",
								"::placeholder": {
									color: "#aaa",
								},
							},
							invalid: {
								color: "#ff0000", // Red color for invalid inputs
							},
						},
					}}
				/>
			</div>
			<SubmitButton
				loadingText="Processing..."
				isLoading={isLoading}
				className="w-full mt-4"
			>
				Complete Payment
			</SubmitButton>
		</form>
	);
};

const PaymentPage = ({ params }: { params: { id: string } }) => {
	const router = useRouter();
	const { id: courseId } = params; // Extract courseId from dynamic route params
	const [clientSecret, setClientSecret] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true); // Loading state for clientSecret

	useEffect(() => {
		const queryParams = new URLSearchParams(window.location.search);
		const clientSecretFromUrl = queryParams.get("clientSecret");

		console.log("clientSecretFromUrl: ", clientSecretFromUrl);

		if (clientSecretFromUrl) {
			setClientSecret(clientSecretFromUrl);
			setLoading(false);
		} else {
			router.push("/"); // Redirect to homepage if clientSecret is missing
		}
	}, [router]);

	if (loading) {
		return (
			<div className=" flex justify-center items-center">
				<Loader className="p-2 animate-spin" /> {/* Custom Spinner Component */}
				<p>Loading payment details...</p>
			</div>
		);
	}

	return (
		<div className=" max-w-md mx-auto p-6 bg-white shadow-sm rounded-lg mt-8">
			<h2 className="text-2xl font-semibold mb-6">Complete Your Payment</h2>
			<p className="mb-4 text-xs">
				You are about to pay for course{" "}
				<span className="p-[2px] bg-secondary px-2 rounded-sm italic font-semibold">
					{courseId}
				</span>
				. Please confirm your payment details below.
			</p>

			<div className="payment-details">
				{clientSecret ? (
					<Elements stripe={stripePromise} options={{ clientSecret }}>
						<PaymentForm clientSecret={clientSecret} courseId={courseId} />
					</Elements>
				) : (
					<p>Loading payment details...</p>
				)}
			</div>
		</div>
	);
};

export default PaymentPage;
