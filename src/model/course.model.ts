import mongoose, { Document, Schema, Model } from "mongoose";
import { IUser } from "./user.model";

// Define the interface for lessons within a section
export interface ILesson {
	_id: mongoose.Types.ObjectId;
	title: string;
	content: string;
	videoUrl?: string; // Optional field
	duration?: number; // Optional field in minutes
	preview?: boolean; // Optional field for lesson preview
}

// Define the interface for a section, extending Mongoose's Document
export interface ISection extends Document {
	_id: mongoose.Types.ObjectId;
	title: string;
	lessons: ILesson[];
}

// Create a schema for sections
const SectionSchema: Schema<ISection> = new Schema({
	title: { type: String, required: true },
	lessons: {
		type: [
			{
				title: { type: String, required: true },
				content: { type: String, required: true },
				videoUrl: { type: String, required: false },
				duration: { type: Number, required: false },
				preview: { type: Boolean, default: false },
			},
		],
		validate: {
			validator: (v) => v.length > 0,
			message: "Each section must have at least one lesson",
		},
	},
});

// Define the interface for a review
interface IReview extends Document {
	studentId: mongoose.Types.ObjectId;
	rating: number;
	comment?: string; // Optional field
	createdAt: Date;
	updatedAt: Date;
}

// Create a schema for course reviews
const ReviewSchema: Schema<IReview> = new Schema(
	{
		studentId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		rating: { type: Number, required: true, min: 1, max: 5 },
		comment: { type: String, required: false },
	},
	{ timestamps: true }
);

// Enhanced ICourse interface
export interface ICourse extends Document {
	_id: mongoose.Types.ObjectId;
	title: string;
	description: string;
	category: string;
	level: "Beginner" | "Intermediate" | "Advanced";
	price: number;
	language: string;
	thumbnailUrl?: string;
	creatorId: mongoose.Types.ObjectId;
	creator?: IUser;
	sections: ISection[];
	reviews: IReview[];
	enrollmentCount: number;
	enrolledStudent: mongoose.Types.ObjectId[];
	createdAt: Date;
	updatedAt: Date;
	tags: string[];
	prerequisites: string[];
	duration: number;
	skillsGained: string[];
	isPublished: boolean;
	averageRating: number;
	certificateOffered: boolean;
	discountPrice?: number;
	studentsCompleted: number;
	totalLessons: number;
}

// Enhanced CourseSchema
const CourseSchema: Schema<ICourse> = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		category: { type: String, required: true },
		level: {
			type: String,
			enum: ["Beginner", "Intermediate", "Advanced"],
			default: "Beginner",
		},
		price: { type: Number, required: true },
		language: { type: String, required: true, default: "English" },
		thumbnailUrl: { type: String, required: false },
		creatorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		sections: [SectionSchema],
		reviews: [ReviewSchema],
		enrollmentCount: { type: Number, default: 0 },
		enrolledStudent: [
			{
				type: mongoose.Types.ObjectId,
				ref: "User",
				validate: {
					validator: function (v) {
						return v.length === new Set(v.map((id: any) => id.toString())).size;
					},
					message: "A student cannot be enrolled more than once",
				},
			},
		],
		tags: [
			{
				type: String,
				required: false,
				validate: {
					validator: (v) => v.trim() !== "",
					message: "Tags must be non-empty strings",
				},
			},
		],
		prerequisites: [
			{
				type: String,
				required: false,
				validate: {
					validator: (v) => v.trim() !== "",
					message: "Prerequisites must be non-empty strings",
				},
			},
		],
		duration: { type: Number, required: true, min: 0, default: 0 },
		skillsGained: [{ type: String, required: false }],
		isPublished: { type: Boolean, default: false },
		averageRating: { type: Number, default: 0, min: 0, max: 5 },
		certificateOffered: { type: Boolean, default: false },
		discountPrice: { type: Number, required: false },
		studentsCompleted: { type: Number, default: 0 },
		totalLessons: { type: Number, default: 0 },
	},
	{ timestamps: true }
);

// Indexing with proper weights for full-text search
CourseSchema.index(
	{
		title: "text",
		skillsGained: "text",
		category: "text",
	},
	{
		weights: {
			title: 5,
			skillsGained: 2,
			category: 1,
		},
	}
);

// Non-text indexes for filtering and sorting
CourseSchema.index({ category: 1 });
CourseSchema.index({ level: 1 });
CourseSchema.index({ price: 1 });
CourseSchema.index({ language: 1 });
CourseSchema.index({ tags: 1 });
CourseSchema.index({ creatorId: 1 });

// Middleware to update averageRating when a review is added or modified
CourseSchema.pre("save", async function (next) {
	if (this.isModified("reviews")) {
		const totalRating = this.reviews.reduce(
			(sum, review) => sum + review.rating,
			0
		);
		this.averageRating =
			this.reviews.length > 0 ? totalRating / this.reviews.length : 0;
	}

	// Handle sections, duration, and total lessons
	if (this.isModified("sections")) {
		let totalDuration = 0;
		let totalLessons = 0;
		this.sections.forEach((section) => {
			section.lessons.forEach((lesson) => {
				if (lesson.duration) totalDuration += lesson.duration;
				totalLessons++;
			});
		});
		this.duration = totalDuration;
		this.totalLessons = totalLessons;
	}

	// Handle enrollmentCount
	if (this.isModified("enrollmentCount") && this.enrollmentCount < 0) {
		this.enrollmentCount = 0;
	}

	// Handle discountPrice validation
	if (this.isModified("discountPrice") && this.discountPrice! >= this.price) {
		throw new Error("Discount price must be less than regular price");
	}

	next();
});

// Virtual for calculating savings percentage
CourseSchema.virtual("savingsPercentage").get(function () {
	if (this.discountPrice && this.price) {
		return Math.round(((this.price - this.discountPrice) / this.price) * 100);
	}
	return 0;
});

// Ensure virtuals are included in toJSON output
CourseSchema.set("toJSON", { virtuals: true });
CourseSchema.set("toObject", { virtuals: true });

// Export the Course model
const Course: Model<ICourse> =
	mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);

Course.createIndexes()
	.then(() => console.log("Indexes created successfully"))
	.catch((err) => console.error("Index creation failed:", err));

export default Course;
