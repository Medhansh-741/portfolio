import type { MetadataRoute } from "next";
import { profile } from "@/app/data/profile";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = "https://medhanshk.me";
	const now = new Date();

	const projectUrls: MetadataRoute.Sitemap = profile.projects.map((p) => ({
		url: `${baseUrl}/projects/${p.title.toLowerCase().replace(/\s+/g, "-")}`,
		lastModified: now,
	}));

	return [
		{
			url: `${baseUrl}`,
			lastModified: now,
		},
		{
			url: `${baseUrl}/projects`,
			lastModified: now,
		},
		...projectUrls,
		{
			url: `${baseUrl}/experience`,
			lastModified: now,
		},
		{
			url: `${baseUrl}/about`,
			lastModified: now,
		},
		{
			url: `${baseUrl}/resume.pdf`,
			lastModified: now,
		},
	];
}
