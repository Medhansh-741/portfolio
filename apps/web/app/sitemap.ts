import { getProjectSlug, profile, staticRoutes } from "@portfolio/data";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = "https://medhanshk.me";
	const lastModified = profile.contentUpdatedAt;

	const staticRouteUrls: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
		url: route.path.startsWith("http") ? route.path : `${baseUrl}${route.path}`,
		lastModified,
	}));

	const projectUrls: MetadataRoute.Sitemap = profile.projects.map((p) => ({
		url: `${baseUrl}/projects/${getProjectSlug(p.title)}`,
		lastModified,
	}));

	return [{ url: baseUrl, lastModified }, ...staticRouteUrls, ...projectUrls];
}
