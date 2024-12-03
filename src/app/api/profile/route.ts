import { NextResponse } from "next/server";
import db from "@/lib/connectDB";
import User from "@/model/user.model";
import { auth } from "@clerk/nextjs/server";

export async function PUT(req: Request) {
	try {
		const { userId } = auth();
		if (!userId)
			return NextResponse.json(
				{ message: "Unauthorized", success: false },
				{ status: 401 }
			);

		const body = await req.json();

		// Validate and filter allowed update fields
		const allowedFields = {
			bio: body.bio,
			socialMediaLinks: body.socialMediaLinks,
		};

		// Remove undefined fields
		Object.keys(allowedFields).forEach(
			(key) =>
				allowedFields[key as keyof typeof allowedFields] === undefined &&
				delete allowedFields[key as keyof typeof allowedFields]
		);

		await db(); // Connect to the database
		const user = await User.findOneAndUpdate(
			{ clerkUserId: userId },
			{ $set: allowedFields },
			{ new: true }
		);

		if (!user) {
			return NextResponse.json(
				{ message: "User not found", success: false },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			message: "Profile updated successfully",
			success: true,
			user: {
				bio: user.bio,
				socialMediaLinks: user.socialMediaLinks,
			},
		});
	} catch (error: any) {
		return NextResponse.json(
			{ message: error.message || "Internal Server Error", success: false },
			{ status: 500 }
		);
	}
}

export async function GET(req: Request) {
	try {
		const { userId } = auth();
		if (!userId)
			return NextResponse.json(
				{ message: "Unauthorized", success: false },
				{ status: 401 }
			);

		await db(); // Connect to the database
		const user = await User.findOne({ clerkUserId: userId });

		if (!user) {
			return NextResponse.json(
				{ message: "User not found", success: false },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			user: {
				bio: user.bio,
				socialMediaLinks: user.socialMediaLinks,
			},
		});
	} catch (error: any) {
		return NextResponse.json(
			{ message: error.message || "Internal Server Error", success: false },
			{ status: 500 }
		);
	}
}
