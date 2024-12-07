import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface UsePaymentProps {
	courseId: string;
	amount: number; // amount will reflect the total price
}

interface UsePaymentReturn {
	initiatePayment: () => Promise<void>;
	loading: boolean;
}

const usePayment = ({
	courseId,
	amount,
}: UsePaymentProps): UsePaymentReturn => {
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const initiatePayment = async () => {
		try {
			setLoading(true);
			// Call the payment-intent API with the courseId and total amount
			const { data } = await axios.post("/api/payment-intent", {
				courseId,
				amount, // The total amount to be paid
			});

			// Redirect to payment page with clientSecret
			router.push(
				`/course/${courseId}/payment?clientSecret=${data.clientSecret}`
			);
		} catch (err) {
			console.error("Payment initiation failed:", err);
			alert("Something went wrong. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return { initiatePayment, loading };
};

export default usePayment;
