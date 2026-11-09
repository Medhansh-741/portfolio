import type { MetadataRoute } from "next";
import { profile, staticRoutes, getProjectSlug } from "@/app/data/profile";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = "https://medhanshk.me";

	const staticRouteUrls: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
		url: route.path.startsWith("http") ? route.path : `${baseUrl}${route.path}`,
	}));

	const projectUrls: MetadataRoute.Sitemap = profile.projects.map((p) => ({
		url: `${baseUrl}/projects/${getProjectSlug(p.title)}`,
	}));

	return [
		{ url: baseUrl },
		...staticRouteUrls,
		...projectUrls,
	];
}
