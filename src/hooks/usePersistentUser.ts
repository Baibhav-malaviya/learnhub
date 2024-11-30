import { useState, useEffect, useCallback } from "react";
import { useUser, useAuth } from "@clerk/nextjs";

const usePersistentUser = () => {
	const { user, isSignedIn } = useUser();
	const { signOut } = useAuth(); // Clerk's sign-out function
	const [persistentUser, setPersistentUser] = useState(() => {
		const storedUser = localStorage.getItem("userData");
		return storedUser ? JSON.parse(storedUser) : null;
	});
	const [isUserSignedIn, setIsUserSignedIn] = useState(() => {
		const storedSignedIn = localStorage.getItem("isSignedIn");
		return storedSignedIn ? JSON.parse(storedSignedIn) : false;
	});

	useEffect(() => {
		if (isSignedIn !== undefined) {
			localStorage.setItem("isSignedIn", JSON.stringify(isSignedIn));
			setIsUserSignedIn(isSignedIn);
		}

		if (user) {
			localStorage.setItem("userData", JSON.stringify(user));
			setPersistentUser(user);
		}
	}, [user, isSignedIn]);

	const handleLogout = useCallback(async () => {
		// Clear localStorage and log out
		localStorage.removeItem("userData");
		localStorage.removeItem("isSignedIn");
		setPersistentUser(null);
		setIsUserSignedIn(false);
		await signOut();
	}, [signOut]);

	return { user: persistentUser, isSignedIn: isUserSignedIn, handleLogout };
};

export default usePersistentUser;
