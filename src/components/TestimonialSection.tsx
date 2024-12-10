// components/TestimonialsSection.tsx
import Section from "./myComponents/Section";
import TestimonialCard from "./TestimonialCard";

const testimonials: Testimonial[] = [
	{
		id: "1",
		name: "Jane Doe",
		content:
			"LearnHub has transformed my learning experience with its diverse courses and flexible schedule.",
	},
	{
		id: "2",
		name: "John Smith",
		content:
			"The expert instructors at LearnHub make complex topics easy to understand and engaging.",
	},
	{
		id: "3",
		name: "Emily Johnson",
		content:
			"I appreciate the range of certifications offered by LearnHub, which have been valuable for my career.",
	},
	{
		id: "4",
		name: "Michael Brown",
		content:
			"LearnHub’s user-friendly platform and responsive support team have greatly enhanced my learning journey.",
	},
];

interface Testimonial {
	id: string;
	name: string;
	content: string;
}

const TestimonialsSection = () => (
	<Section className=" container">
		<h2 className="text-2xl font-bold text-center mb-6">
			What Our Students Say
		</h2>
		<div className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
			{testimonials.map((testimonial) => (
				<TestimonialCard
					key={testimonial.id}
					name={testimonial.name}
					content={testimonial.content}
				/>
			))}
		</div>
	</Section>
);

export default TestimonialsSection;
