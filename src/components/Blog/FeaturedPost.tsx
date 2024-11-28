import Section from "../myComponents/Section";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface FeaturedPost {
	title: string;
	description: string;
	imageUrl: string;
}

const featuredPosts: FeaturedPost[] = [
	{
		title: "How to Excel in Online Learning",
		description: "Tips and tricks to boost your learning productivity.",
		imageUrl: "/images/blog-background.jpg",
	},
	{
		title: "Top 10 Resources for JavaScript",
		description: "Master JavaScript with these essential resources.",
		imageUrl: "/images/blog-background.jpg",
	},
];

const FeaturedPosts = () => {
	return (
		<Section className="grid grid-cols-1 md:grid-cols-2 gap-12 justify-between container  px-0">
			{featuredPosts.map((post, index) => (
				<Card
					key={index}
					className="relative overflow-hidden h-64 hover:hover-card"
				>
					<div
						className="absolute inset-0 bg-cover bg-center"
						style={{ backgroundImage: `url(${post.imageUrl})` }}
					/>
					<div className="absolute inset-0 bg-black bg-opacity-50" />
					<CardHeader className="relative text-white z-10 p-6">
						<CardTitle className="text-xl">{post.title}</CardTitle>
						<CardDescription>{post.description}</CardDescription>
					</CardHeader>
				</Card>
			))}
		</Section>
	);
};

export default FeaturedPosts;
