import React from "react";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
	src: string;
	alt?: string;
	width?: number;
	height?: number;
}

const Logo: React.FC<LogoProps> = ({
	src,
	alt = "Logo",
	width = 100,
	height = 100,
}) => {
	return (
		<Link
			href={"/"}
			className="flex items-center justify-center p-4 bg-transparent rounded-lg overflow-hidden"
		>
			<Image
				src={src}
				alt={alt}
				width={width}
				height={height}
				className="w-full h-auto object-contain"
			/>
		</Link>
	);
};

export default Logo;
