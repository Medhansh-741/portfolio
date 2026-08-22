import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = "https://medhanshk.me";
	const now = new Date();

	return [
		{
			url: `${baseUrl}`,
			lastModified: now,
		},
		{
			url: `${baseUrl}/projects`,
			lastModified: now,
		},
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
