import { create } from "zustand";
import { immer } from "zustand/middleware/immer"; //! handle later. This is for mutating data.
import { persist } from "zustand/middleware"; //! handle later. This is for caching.
import { ICourse } from "@/model/course.model";
import axios from "axios";
import { IFormData } from "@/app/create/new/page";
import mongoose from "mongoose";

interface ICreatedCourse {
	courses: ICourse[] | []; // Changed from `course` to `courses`
	addCourse: (formData: IFormData) => void;
	removeCourse: (courseId: mongoose.Types.ObjectId) => void;
	fetchCourses: () => void; // New function to fetch courses
}

export const useCreatedCourse = create<ICreatedCourse>((set) => ({
	courses: [],

	// Fetch courses from the API
	fetchCourses: async () => {
		try {
			const { data } = await axios.get("/api/courses/creator");
			set({ courses: data.courses });
		} catch (error) {
			console.log("Error in fetching the courses for creator: ", error);
		}
	},

	addCourse: async (formData) => {
		try {
			const { data } = await axios.post("/api/create/courses", formData);

			// After successfully creating a course, update the courses array
			set((state) => ({
				courses: [...state.courses, data.course], // Assuming the API returns the newly created course
			}));
		} catch (error) {
			console.log("Error in adding a new course: ", error);
		}
	},

	removeCourse: async () => {
		// Logic for removing a course can go here
	},
}));
