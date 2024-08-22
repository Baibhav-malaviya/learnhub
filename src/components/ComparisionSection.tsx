import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import Section from "./myComponents/Section";

const FeatureComparison = () => {
	return (
		<Section className="bg-background text-foreground container">
			<div className="container mx-auto px-4">
				<h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
					Why Choose Our Platform?
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<Card className="bg-background border-border border-[1px] hover:hover-card grayscale">
						<CardHeader>
							<h3 className="text-xl md:text-2xl font-semibold text-center text-accent-foreground/60">
								Other Platforms
							</h3>
						</CardHeader>
						<CardContent>
							<ul className="space-y-3">
								{[
									"Limited course selection",
									"Inflexible learning paths",
									"Outdated content",
									"Minimal interaction",
									"Generic certificates",
								].map((text, index) => (
									<li key={index} className="flex items-center space-x-3 ">
										<div className="rounded-full p-1 bg-destructive/20">
											<X className="w-4 h-4 text-destructive stroke-[3]" />
										</div>
										<span className="text-sm md:text-base text-accent-foreground/60">
											{text}
										</span>
									</li>
								))}
							</ul>
						</CardContent>
					</Card>

					<Card className="relative overflow-hidden hover:hover-card">
						<div className="absolute inset-0 bg-gradient-to-bl from-secondary via-secondary/20  to-transparent "></div>
						<CardHeader className="relative">
							<h3 className="text-xl md:text-2xl font-semibold text-center text-secondary">
								Learnhub
							</h3>
						</CardHeader>
						<CardContent className="relative">
							<ul className="space-y-3">
								{[
									"Diverse, curated courses",
									"Personalized learning paths",
									"Regularly updated content",
									"Interactive live sessions",
									"Industry-recognized certifications",
								].map((text, index) => (
									<li key={index} className="flex items-center space-x-3">
										<div className="rounded-full p-1 bg-secondary/20">
											<Check className="w-5 h-5 text-secondary stroke-[3]" />
										</div>
										<span className="text-sm md:text-base">{text}</span>
									</li>
								))}
							</ul>
						</CardContent>
					</Card>
				</div>
			</div>
		</Section>
	);
};

export default FeatureComparison;
