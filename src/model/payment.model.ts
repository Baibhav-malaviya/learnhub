import mongoose, { Schema, Document, Model } from "mongoose";

interface IPayment extends Document {
	userId: mongoose.Types.ObjectId;
	courseId: mongoose.Types.ObjectId;
	amount: number;
	currency: string;
	paymentStatus: "succeeded" | "pending" | "failed" | "refunded";
	paymentMethod: string;
	failureReason?: string;
	transactionId?: string; // this will be unique across the payment provider
	paymentProvider?: string;
	metadata?: Record<string, any>;
	refundAmount?: number;
	refundReason?: string;
	expirationDate?: Date;
	deletedAt?: Date; // for soft deletion
	createdAt: Date;
	updatedAt: Date;
}

const PaymentSchema: Schema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		courseId: {
			type: Schema.Types.ObjectId,
			ref: "Course",
			required: true,
			index: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		currency: {
			type: String,
			required: true,
			enum: ["USD", "EUR", "INR"], // Add supported currencies
		},
		paymentStatus: {
			type: String,
			enum: ["succeeded", "pending", "failed", "refunded"],
			required: true,
			index: true,
		},
		paymentMethod: {
			type: String,
			required: true,
		},
		failureReason: {
			type: String,
		},
		transactionId: {
			type: String,
			sparse: true,
			unique: true,
			index: true, // Ensure fast queries by transactionId
		},
		paymentProvider: {
			type: String,
		},
		metadata: {
			type: Schema.Types.Mixed,
		},
		refundAmount: {
			type: Number,
		},
		refundReason: {
			type: String,
		},
		expirationDate: {
			type: Date,
			default: function () {
				return new Date(new Date().getTime() + 60 * 60 * 1000); // 1 hour from creation
			},
		},
		deletedAt: {
			type: Date,
			default: null, // For soft deletion
		},
	},
	{ timestamps: true }
);

// Create compound index for common queries
PaymentSchema.index({ userId: 1, courseId: 1, createdAt: -1 });
PaymentSchema.index({ transactionId: 1 }, { unique: true, sparse: true });

// Pre-save hook to validate refund amount
PaymentSchema.pre("save", function (next) {
	if (this.refundAmount != null && this.amount != null) {
		if (this.refundAmount > this.amount) {
			return next(
				new Error(
					"Refund amount cannot be greater than the original payment amount"
				)
			);
		}
	}
	next();
});

// // Post-save hook to handle asynchronous updates (e.g., external payment status updates)
// PaymentSchema.post("save", async function (doc, next) {
// 	// Example: Handle an external webhook or event based on payment status
// 	if (doc.paymentStatus === "pending") {
// 		// Trigger async actions, e.g., set up a webhook listener for payment completion
// 	}
// 	next();
// });

const Payment: Model<IPayment> =
	mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;
