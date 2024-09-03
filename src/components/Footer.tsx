// components/Footer.tsx
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer: React.FC = () => {
	return (
		<footer className="bg-muted text-muted-foreground py-8">
			<div className="container mx-auto px-4">
				<div className="flex flex-wrap justify-between">
					{/* Logo and Description */}
					<div className="w-full md:w-1/4 mb-6 md:mb-0">
						<Link href={"/"} className="text-2xl font-bold text-primary mb-4">
							LearnHub
						</Link>
						<p className="text-muted-foreground text-sm">
							Your go-to platform for a wide range of online courses taught by
							experts in the field.
						</p>
					</div>

					{/* Navigation Links */}
					<div className="w-full md:w-1/4 mb-6 md:mb-0">
						<h3 className="text-lg font-semibold text-primary mb-4">
							Quick Links
						</h3>
						<ul>
							<li className="mb-2">
								<Link
									href="/about"
									className="text-muted-foreground hover:text-primary"
								>
									About Us
								</Link>
							</li>
							<li className="mb-2">
								<Link
									href="/courses"
									className="text-muted-foreground hover:text-primary"
								>
									Courses
								</Link>
							</li>
							<li className="mb-2">
								<Link
									href="/blog"
									className="text-muted-foreground hover:text-primary"
								>
									Blog
								</Link>
							</li>
							<li className="mb-2">
								<Link
									href="/contact"
									className="text-muted-foreground hover:text-primary"
								>
									Contact
								</Link>
							</li>
						</ul>
					</div>

					{/* Social Media Links */}
					<div className="w-full md:w-1/4 mb-6 md:mb-0">
						<h3 className="text-lg font-semibold text-primary mb-4">
							Follow Us
						</h3>
						<div className="flex space-x-4">
							<Link
								href="#"
								className="text-muted-foreground hover:text-primary"
							>
								<Facebook className="w-6 h-6" />
							</Link>
							<Link
								href="#"
								className="text-muted-foreground hover:text-primary"
							>
								<Twitter className="w-6 h-6" />
							</Link>
							<Link
								href="#"
								className="text-muted-foreground hover:text-primary"
							>
								<Instagram className="w-6 h-6" />
							</Link>
							<Link
								href="#"
								className="text-muted-foreground hover:text-primary"
							>
								<Linkedin className="w-6 h-6" />
							</Link>
						</div>
					</div>
				</div>

				{/* Bottom Footer */}
				<div className="mt-8 border-t border-border pt-4 text-center">
					<p className="text-muted-foreground text-sm">
						© {new Date().getFullYear()} LearnHub. All Rights Reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
