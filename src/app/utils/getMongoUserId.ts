import connectDB from "@/lib/connectDB";
import User from "@/model/user.model";
import { IUser } from "@/model/user.model";
import mongoose from "mongoose";

export default async function getUserByClerkId(
	clerkUserId: string | mongoose.Types.ObjectId
): Promise<IUser | null> {
	try {
		await connectDB(); // Ensure the database connection is established

		// Find user document by clerkUserId
		const user = await User.findOne({ clerkUserId }).exec(); // Use .exec() for better practice
		return user;
	} catch (error) {
		console.error("Error fetching user:", error);
		return null;
	}
}
