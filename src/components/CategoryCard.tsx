import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"; // Adjust import path if needed
import { cn } from "@/lib/utils"; // Utility for conditional class names
import { generateSlug } from "@/utils/commonFunc";

interface CategoryCardProps {
	title: string;
	icon: string;
	description: string;
}

const CategoryCard = ({ title, icon, description }: CategoryCardProps) => {
	// Convert title to a URL-friendly format
	const slug = generateSlug(title);

	return (
		<Link href={`/courses/${slug}`} passHref>
			<Card
				className={cn(
					"relative overflow-hidden rounded-md w-64 h-auto",
					"hover:shadow-lg transition-shadow duration-300"
				)}
			>
				<CardHeader className="relative w-full h-40">
					<Image
						src={icon}
						alt={`${title} icon`}
						layout="fill"
						objectFit="cover"
						className="absolute inset-0"
					/>
					<div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-4">
						<div>
							<h3 className="text-lg font-semibold text-primary">{title}</h3>
							<p className="text-sm text-gray-200 mt-1">{description}</p>
						</div>
					</div>
				</CardHeader>
				<CardFooter className="p-3 border-t border-gray-200">
					<Link
						href={"/courses"}
						className="text-xs text-gray-500 hover:text-gray-800"
					>
						Explore more
					</Link>
				</CardFooter>
			</Card>
		</Link>
	);
};

export default CategoryCard;
