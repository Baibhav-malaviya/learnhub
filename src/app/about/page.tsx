import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

function AboutPage() {
	return (
		<div className="container mx-auto py-10 space-y-8">
			{/* About Us Section */}
			<Card className="max-w-3xl mx-auto">
				<CardHeader>
					<CardTitle>About Us</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">
						Welcome to our learning platform! We are dedicated to creating a
						space where students and tutors can connect to share knowledge and
						grow together. Our goal is to empower learners and educators through
						a seamless, user-friendly online platform.
					</p>
				</CardContent>
			</Card>

			{/* Our Mission */}
			<Card className="max-w-3xl mx-auto">
				<CardHeader>
					<CardTitle>Our Mission</CardTitle>
				</CardHeader>
				<CardContent>
					<p>
						Our mission is to make high-quality education accessible to
						everyone, regardless of location or background. We aim to bridge the
						gap between learners and experts, enabling growth through knowledge
						sharing and skill development.
					</p>
				</CardContent>
			</Card>

			{/* Features Section */}
			<Card className="max-w-3xl mx-auto">
				<CardHeader>
					<CardTitle>Features</CardTitle>
				</CardHeader>
				<CardContent>
					<ul className="list-disc pl-5">
						<li>Comprehensive course creation tools for tutors.</li>
						<li>Interactive learning experience for students.</li>
						<li>Video lessons, quizzes, and downloadable resources.</li>
						<li>Progress tracking and certification on course completion.</li>
						<li>Community-driven discussions and Q&A sections.</li>
					</ul>
				</CardContent>
			</Card>

			{/* Contact Section */}
			<Card className="max-w-3xl mx-auto">
				<CardHeader>
					<CardTitle>Contact Us</CardTitle>
				</CardHeader>
				<CardContent>
					<p>Have questions or need support? Reach out to us:</p>
					<ul className="list-none space-y-2 mt-4">
						<li>
							Email:{" "}
							<a
								href="mailto:support@learningplatform.com"
								className="text-blue-500"
							>
								support@learningplatform.com
							</a>
						</li>
						<li>
							Phone:{" "}
							<a href="tel:+1234567890" className="text-blue-500">
								+123 456 7890
							</a>
						</li>
						<li>Address: 123 Learning Lane, Knowledge City, EduLand</li>
					</ul>
				</CardContent>
			</Card>
		</div>
	);
}

export default AboutPage;
