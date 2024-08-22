"use client";

import CategoriesOverview from "@/components/CategoryOverview";
import FeatureComparison from "@/components/ComparisionSection";
import FeaturedCourses from "@/components/FeaturedCourses";
import SearchBarHero from "@/components/HeroSection";
import InstructorSpotlightSection from "@/components/InstructorSection";
import TestimonialsSection from "@/components/TestimonialSection";
import { useUser } from "@clerk/nextjs";

// Render a YouTube video player
const url =
	"https://res.cloudinary.com/baibhavmalaviya/video/upload/sp_hd/v1/tutorial_videos/vsvkrjdikfisjtcbxu88.m3u8?_a=BAMABkRg0";

export default function Home() {
	const { isLoaded, user } = useUser();

	return (
		<>
			<SearchBarHero />
			<FeaturedCourses />
			<CategoriesOverview />
			<FeatureComparison />
			<TestimonialsSection />
			<InstructorSpotlightSection />
		</>
	);
}
