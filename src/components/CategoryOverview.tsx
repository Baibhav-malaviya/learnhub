// components/CategoriesOverview.tsx
import CategoryCard from "./CategoryCard";
import Section from "./myComponents/Section";

const categories = [
	{
		id: "web-development",
		title: "Web Development",
		icon: "/images/hero-background.jpg",
		description: "Build websites and web applications",
	},
	{
		id: "data-science",
		title: "Data Science",
		icon: "/images/hero-background.jpg",
		description: "Analyze and visualize data",
	},
	{
		id: "DevOps",
		title: "DevOps",
		icon: "/images/hero-background.jpg",
		description: "Analyze the work flow",
	},
	{
		id: "Fashion",
		title: "Fashion",
		icon: "/images/hero-background.jpg",
		description: "Explore the fashion",
	},
	// More categories
];

const CategoriesOverview = () => (
	<Section className="container bg-background">
		<h2 className="text-2xl font-bold text-center mb-6">Explore Categories</h2>
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
			{categories.map((category) => (
				<CategoryCard
					key={category.id}
					title={category.title}
					icon={category.icon}
					description={category.description}
				/>
			))}
		</div>
	</Section>
);

export default CategoriesOverview;
