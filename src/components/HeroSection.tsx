"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SearchInput from "./SearchInput";

const MergedHero = () => {
	return (
		<section
			className="bg-cover bg-center w-full py-20 text-center"
			style={{
				backgroundImage: "url('images/hero-background.jpg')", // Add your image path here
				backgroundColor: "rgba(0, 0, 0, 0.5)", // Fallback background color
				backgroundBlendMode: "overlay", // Blend image and color
			}}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<h1 className="text-3xl font-bold text-white mb-4">
					Empower Your Learning Journey
				</h1>
				<p className="text-white text-lg mb-8">
					Access top-tier courses, engage with expert tutors, and transform your
					skills from anywhere, at any time.
				</p>

				<SearchInput />
				<div className="flex justify-center space-x-4">
					<Button variant="default" size="lg">
						Explore Courses
					</Button>
					<Button variant="secondary" size="lg">
						Learn More
					</Button>
				</div>
			</div>
		</section>
	);
};

export default MergedHero;
