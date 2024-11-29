import { NextRequest, NextResponse } from "next/server";
import Gift from "@/model/gift.model";
import { v4 as uuidv4 } from "uuid";
import connectDB from "@/lib/connectDB"; // Ensure database connection
import { getAuth } from "@clerk/nextjs/server";
import User from "@/model/user.model";

export async function POST(req: NextRequest) {
	try {
		await connectDB();
		const { courseId, copies } = await req.json();

		const { userId: clerkUserId } = getAuth(req);

		const user = await User.findOne({ clerkUserId });

		if (!user)
			return NextResponse.json({ message: "user not found | UnAuthorized" });

		if (copies < 1) {
			return NextResponse.json(
				{ message: "Number of copies must be at least 1.", success: false },
				{ status: 400 }
			);
		}

		const qrCodeData = uuidv4(); // Generate a unique identifier for the QR code

		const newGift = await Gift.create({
			courseId,
			giftedBy: user._id,
			qrCodeData,
			totalCopies: copies,
			remainingCopies: copies,
			isActive: true,
		});

		return NextResponse.json({
			message: "Courses bought successfully",
			success: true,
			qrData: qrCodeData,
		});
	} catch (error) {
		return NextResponse.json(
			{
				error: "Error in buying course",
				message: "Error in buying course.",
				success: true,
			},
			{ status: 500 }
		);
	}
}
