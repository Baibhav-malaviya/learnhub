import mongoose, { Document, Schema, Model } from "mongoose";

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
	title: {
		type: String,
		required: true,
	},
	lessons: [
		{
			title: {
				type: String,
				required: true,
			},
			content: {
				type: String,
				required: true,
			},
			videoUrl: {
				type: String,
				required: false, // Optional if there's no video
			},
			duration: {
				type: Number,
				required: false, // Optional, in minutes
			},
			preview: {
				type: Boolean,
				required: false, // Optional, indicates if the lesson is a preview
				default: false, // Default to false if not specified
			},
		},
	],
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
		rating: {
			type: Number,
			required: true,
			min: 1,
			max: 5,
		},
		comment: {
			type: String,
			required: false,
		},
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
	totalLessons: number; // New field
}

// Enhanced CourseSchema
const CourseSchema: Schema<ICourse> = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		level: {
			type: String,
			enum: ["Beginner", "Intermediate", "Advanced"],
			default: "Beginner",
		},
		price: {
			type: Number,
			required: true,
		},
		language: {
			type: String,
			required: true,
			default: "English",
		},
		thumbnailUrl: {
			type: String,
			required: false,
			default: "https://via.placeholder.com/400x250?text",
		},
		creatorId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		sections: [SectionSchema], // Array of sections
		reviews: [ReviewSchema], // Array of reviews
		enrollmentCount: {
			type: Number,
			default: 0,
		},
		enrolledStudent: [
			{
				type: mongoose.Types.ObjectId,
				ref: "User",
			},
		],

		// New fields
		tags: [
			{
				type: String,
				required: false,
			},
		],
		prerequisites: [
			{
				type: String,
				required: false,
			},
		],
		duration: {
			type: Number,
			required: true,
			min: 0,
			default: 0,
		},
		skillsGained: [
			{
				type: String,
				required: false,
			},
		],
		isPublished: {
			type: Boolean,
			default: false,
		},
		averageRating: {
			type: Number,
			default: 0,
			min: 0,
			max: 5,
		},
		certificateOffered: {
			type: Boolean,
			default: false,
		},
		discountPrice: {
			type: Number,
			required: false,
		},
		studentsCompleted: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

// Indexing which help in searching and filtering
CourseSchema.index({
	title: "text",
	description: "text",
	skillsGained: "text",
	category: "text",
});

// Full-text index
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
	next();
});

// Middleware to calculate total duration and total lessons
CourseSchema.pre("save", async function (next) {
	console.log();
	if (this.isModified("sections")) {
		let totalDuration = 0;
		let totalLessons = 0;
		console.log("Welcome to pre hook for duration calculation");
		this.sections.forEach((section) => {
			section.lessons.forEach((lesson) => {
				if (lesson.duration) {
					totalDuration += lesson.duration;
				}
				totalLessons++;
			});
		});

		this.duration = totalDuration;
		// this.totalLessons = totalLessons;
	}
	next();
});

// Middleware to update enrollmentCount
CourseSchema.pre("save", async function (next) {
	if (this.isModified("enrollmentCount")) {
		// You might want to add logic here to ensure enrollmentCount
		// doesn't exceed a maximum capacity, if applicable
		if (this.enrollmentCount < 0) {
			this.enrollmentCount = 0;
		}
	}
	next();
});

// Middleware to ensure discountPrice is less than regular price
CourseSchema.pre("save", async function (next) {
	if (this.isModified("discountPrice")) {
		if (this.discountPrice && this.discountPrice >= this.price) {
			throw new Error("Discount price must be less than regular price");
		}
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
export default Course;
