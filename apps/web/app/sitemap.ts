import type { MetadataRoute } from "next";
import { profile, staticRoutes, getProjectSlug } from "@portfolio/data";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = "https://medhanshk.me";

	const staticRouteUrls: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
		url: route.path.startsWith("http") ? route.path : `${baseUrl}${route.path}`,
		...(["/experience", "/about"].includes(route.path) ? { lastModified: profile.contentUpdatedAt } : {}),
	}));

	const projectUrls: MetadataRoute.Sitemap = profile.projects.map((p) => ({
		url: `${baseUrl}/projects/${getProjectSlug(p.title)}`,
	}));

	return [
		{ url: baseUrl, lastModified: profile.contentUpdatedAt },
		...staticRouteUrls,
		...projectUrls,
	];
}
