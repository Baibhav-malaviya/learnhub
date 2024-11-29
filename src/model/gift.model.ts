import mongoose, { Schema, Document } from "mongoose";

export interface IGift extends Document {
	courseId: mongoose.Types.ObjectId;
	giftedBy: mongoose.Types.ObjectId;
	qrCodeData: string; // Unique identifier for the QR code
	totalCopies: number; // Total number of copies bought
	remainingCopies: number; // Remaining copies available for redemption
	isActive: boolean; // Marks if the QR code is still valid
	createdAt: Date;
}

const GiftSchema = new Schema<IGift>(
	{
		courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
		giftedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
		qrCodeData: { type: String, unique: true, required: true },
		totalCopies: { type: Number, required: true },
		remainingCopies: { type: Number, required: true },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true }
);

export default mongoose.models.Gift ||
	mongoose.model<IGift>("Gift", GiftSchema);
