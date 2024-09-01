/** @type {import('next').NextConfig} */
const nextConfig = {
	async redirects() {
		return [
			{
				source: "/create",
				destination: "/create/courses",
				permanent: false,
			},
		];
	},
};

export default nextConfig;
