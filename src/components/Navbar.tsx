"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const NavigationBar = () => {
	const { user, isSignedIn } = useUser();
	const isTutor = user?.unsafeMetadata?.role === "tutor";
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const menuItems = [
		{ name: "Home", href: "/" },
		{ name: "My Course", href: "/my-courses" },
		{ name: "Blog", href: "/blog" },
		{ name: "About Us", href: "/about" },
	];

	if (isTutor) {
		menuItems.push({ name: "Dashboard", href: "/dashboard" });
	}

	const handleMenuItemClick = () => {
		setIsMenuOpen(false);
	};

	return (
		<nav className="bg-background border-b shadow-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<Link href="/" className="text-primary text-xl font-semibold">
						LearnHub
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex space-x-6">
						{menuItems.map((item) => (
							<Link
								key={item.name}
								href={item.href}
								className="text-sm md:text-base font-medium text-muted-foreground hover:text-primary transition-colors"
							>
								{item.name}
							</Link>
						))}
					</div>

					{/* Login/Sign Up or User Profile Button */}
					<div className="hidden md:block">
						{isSignedIn ? (
							<UserButton />
						) : (
							<Button variant="outline" size="sm" asChild className="text-sm">
								<Link href="/sign-in">Login</Link>
							</Button>
						)}
					</div>

					{/* Mobile Navigation */}
					<div className="md:hidden">
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="focus:outline-none"
						>
							<Menu className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
						</button>
						{isMenuOpen && (
							<div className="absolute top-16 right-0 mt-2 w-48 bg-popover rounded-md shadow-lg z-10">
								<ul className="p-4 space-y-2">
									{menuItems.map((item) => (
										<li key={item.name}>
											<Link
												href={item.href}
												className="block text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
												onClick={handleMenuItemClick}
											>
												{item.name}
											</Link>
										</li>
									))}
									<li>
										{isSignedIn ? (
											<UserButton />
										) : (
											<Button
												variant="outline"
												size="sm"
												asChild
												className="w-full mt-2 text-sm"
												onClick={handleMenuItemClick}
											>
												<Link href="/sign-in">Login / Sign Up</Link>
											</Button>
										)}
									</li>
								</ul>
							</div>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default NavigationBar;
