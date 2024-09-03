import { Button } from "../ui/button";
import { Input } from "../ui/input";

const NewsletterSignup = () => {
	return (
		<section className="bg-secondary/40 text-secondary-foreground py-8 rounded-lg my-8">
			<div className="text-center max-w-xl mx-auto">
				<h2 className="text-2xl font-bold">Subscribe to our Newsletter</h2>
				<p className="text-muted-foreground mt-2">
					Get the latest posts and updates delivered directly to your inbox.
				</p>
				<div className="flex justify-center mt-4">
					<Input
						type="email"
						placeholder="Enter your email address"
						className="w-full max-w-md"
					/>
					<Button className="ml-2">Subscribe</Button>
				</div>
			</div>
		</section>
	);
};

export default NewsletterSignup;
