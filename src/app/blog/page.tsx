import BlogHeader from "@/components/Blog/BlogHeader";
import FeaturedPosts from "@/components/Blog/FeaturedPost";
import NewsletterSignup from "@/components/Blog/NewsLetterSignup";
import BlogSearchBar from "@/components/Blog/SearchBar";
import Section from "@/components/myComponents/Section";
import React from "react";

function BlogPage() {
	return (
		<Section className="container ">
			<BlogHeader />
			<BlogSearchBar />
			<FeaturedPosts />
			<NewsletterSignup />
		</Section>
	);
}

export default BlogPage;
