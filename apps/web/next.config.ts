import type { NextConfig } from "next";

// The API lives in apps/api (its own deployment); the site forwards /api/* to it so the browser stays same-origin.
const API_ORIGIN = process.env.API_ORIGIN ?? "http://localhost:3101";

const nextConfig: NextConfig = {
	transpilePackages: ["@portfolio/data"],
	// separate build dirs let several dev servers run side by side (used while porting pages)
	distDir: process.env.NEXT_DIST_DIR ?? ".next",
	devIndicators: false,
	async rewrites() {
		return [{ source: "/api/:path*", destination: `${API_ORIGIN}/api/:path*` }];
	},
	experimental: {
		viewTransition: true,
		// Put the (small) stylesheet inside each page so first paint doesn't wait for a second request.
		inlineCss: true,
	},
	async redirects() {
		return [
			{
				source: "/exp",
				destination: "/experience",
				permanent: true,
			},
			{
				source: "/resume",
				destination: "/resume.pdf",
				permanent: true,
			},
		];
	},
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "Strict-Transport-Security",
						value: "max-age=63072000; includeSubDomains; preload",
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
					{
						key: "Permissions-Policy",
						value: "camera=(), microphone=(), geolocation=()",
					},
				],
			},
		];
	},
};

export default nextConfig;
