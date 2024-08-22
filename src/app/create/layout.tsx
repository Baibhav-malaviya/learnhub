"use client";
import React, { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

interface LayoutProps {
	children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	const pathname = usePathname();

	const menuItems = [
		{ name: "Course", href: "/create/courses" },
		{ name: "Profile", href: "/create/profile" },
		{ name: "Analytics", href: "/create/analytics" },
	];

	const isActive = (path: string) => pathname === path;

	return (
		<div className="flex min-h-screen bg-background container">
			<aside className="w-32 bg-background border-r pt-6 ">
				<nav>
					<ul className="space-y-2">
						{menuItems.map((item) => (
							<li key={item.name}>
								<Link href={item.href}>
									<div
										className={`block text-sm font-medium transition-colors p-2 rounded-md cursor-pointer ${
											isActive(item.href)
												? "text-primary "
												: "text-muted-foreground hover:text-primary"
										}`}
									>
										{item.name}
									</div>
								</Link>
							</li>
						))}
					</ul>
				</nav>
			</aside>

			<main className="flex-1 p-6">
				<div className="flex justify-end mb-4">
					<Link href={"/create/new"}>
						<Button>+ Add Course</Button>
					</Link>
				</div>
				{children}
			</main>
		</div>
	);
};

export default Layout;
