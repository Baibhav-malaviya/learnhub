"use client";

import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react"; // Adjust path as needed
import { ReactNode } from "react";

interface SubmitButtonProps {
	isLoading: boolean;
	loadingText: string;
	className?: string;
	type?: any;
	children: ReactNode;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
	isLoading,
	loadingText,
	className,
	type = "submit",
	children,
}) => {
	return (
		<Button
			type={type}
			className={` ${
				isLoading ? "opacity-70 cursor-not-allowed" : ""
			} ${className}`}
			disabled={isLoading}
		>
			{isLoading ? (
				<>
					<Loader className="animate-spin h-5 w-5 mr-3" />
					{loadingText}
				</>
			) : (
				children
			)}
		</Button>
	);
};

export default SubmitButton;
