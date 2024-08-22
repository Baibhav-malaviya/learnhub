import { Button } from "../ui/button";
import { Input } from "../ui/input";

const BlogSearchBar = () => {
	return (
		<div className="flex justify-center my-6">
			<Input placeholder="Search blog posts..." className="w-full max-w-md" />
			<Button className="ml-2">Search</Button>
		</div>
	);
};

export default BlogSearchBar;
