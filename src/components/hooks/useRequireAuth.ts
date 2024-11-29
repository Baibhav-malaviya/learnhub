import { useAuth } from "@clerk/nextjs";
import { useToast } from "./use-toast";

export const useRequireAuth = () => {
	const { isSignedIn } = useAuth();
	const { toast } = useToast();

	const requireAuth = (actionDescription = "perform this action") => {
		if (!isSignedIn) {
			toast({
				variant: "destructive",
				title: "Login Required",
				description: `Please log in to ${actionDescription}.`,
			});
			return false; // Block further execution
		}
		return true; // Allow execution
	};

	return { requireAuth };
};
