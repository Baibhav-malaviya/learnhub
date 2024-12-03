import mongoose, { Document, Schema, Model } from "mongoose";

export interface ISocialMediaLinks {
	facebook?: string;
	twitter?: string;
	linkedin?: string;
	instagram?: string;
	youtube?: string;
	[key: string]: string | undefined; // Allows for additional platforms
}

// Define the User interface for TypeScript
export interface IUser extends Document {
	_id: mongoose.Types.ObjectId;
	bio?: string;
	clerkUserId?: string;
	email?: string;
	name?: string;
	role?: "student" | "creator" | "admin";
	profileImage?: string;
	enrolledCourses: mongoose.Types.ObjectId[];
	createdCourses: mongoose.Types.ObjectId[];
	socialMediaLinks?: ISocialMediaLinks;
	createdAt: Date;
	updatedAt: Date;
}

// Create the User schema
const UserSchema = new Schema<IUser>(
	{
		clerkUserId: {
			type: String,
			required: true,
			unique: true,
		},
		bio: {
			type: String,
			required: false,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		name: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: ["student", "creator", "admin"],
			default: "student",
			required: true,
		},
		profileImage: {
			type: String,
		},
		enrolledCourses: [
			{
				type: Schema.Types.ObjectId,
				ref: "Course",
			},
		],
		createdCourses: [
			{
				type: Schema.Types.ObjectId,
				ref: "Course",
			},
		],
		socialMediaLinks: {
			facebook: {
				type: String,
			},
			twitter: {
				type: String,
			},
			linkedin: {
				type: String,
			},
			instagram: {
				type: String,
			},
			youtube: {
				type: String,
			},
		},
	},
	{ timestamps: true }
);

// Check if the model already exists before creating a new one
const User: Model<IUser> =
	mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
