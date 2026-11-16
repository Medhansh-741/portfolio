import type { NextConfig } from "next";

// Route handlers only (app/api/*); the site (apps/web) proxies /api/* here.
const nextConfig: NextConfig = {
	transpilePackages: ["@portfolio/data"],
};

export default nextConfig;
