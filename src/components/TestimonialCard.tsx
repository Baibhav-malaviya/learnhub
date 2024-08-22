// components/TestimonialCard.tsx

import { Card, CardContent, CardFooter } from "./ui/card";

interface TestimonialCardProps {
	name: string;
	content: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ name, content }) => (
	<Card className="p-6 rounded-lg shadow-lg bg-gradient-to-br from-secondary via-secondary/20 to-transparent hover:shadow-xl transition-shadow duration-300 ease-in-out">
		<CardContent>
			<p className="text-sm md:text-base italic text-card-foreground mb-4">
				“{content}”
			</p>
		</CardContent>
		<CardFooter>
			<p className="font-semibold text-right text-primary">- {name}</p>
		</CardFooter>
	</Card>
);

export default TestimonialCard;
