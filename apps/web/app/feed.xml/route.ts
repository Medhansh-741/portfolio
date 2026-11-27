import { getProjectSlug, profile, staticRoutes } from "@portfolio/data";

const BASE_URL = "https://medhanshk.me";

function escapeXml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

function toRfc822(date: string): string {
	const parsed = new Date(`${date}T00:00:00Z`);
	return Number.isNaN(parsed.getTime())
		? new Date().toUTCString()
		: parsed.toUTCString();
}

interface FeedItem {
	title: string;
	link: string;
	description: string;
	guid: string;
}

/**
 * RSS 2.0 feed covering every page and project on the site.
 * Gives crawlers and readers a single dated list of what exists and when it last changed.
 */
export async function GET() {
	const lastBuildDate = toRfc822(profile.contentUpdatedAt);

	const items: FeedItem[] = [
		{
			title: `${profile.name} — ${profile.tagline.replace(/\s*\|\s*/, " & ")}`,
			link: BASE_URL,
			description: profile.intro,
			guid: BASE_URL,
		},
		...staticRoutes
			.filter((route) => !route.path.endsWith(".pdf"))
			.map((route) => ({
				title: `${route.name} — ${profile.name}`,
				link: route.path.startsWith("http")
					? route.path
					: `${BASE_URL}${route.path}`,
				description: route.description,
				guid: route.path.startsWith("http")
					? route.path
					: `${BASE_URL}${route.path}`,
			})),
		...profile.projects.map((project) => ({
			title: `${project.title} — ${project.subtitle}`,
			link: `${BASE_URL}/projects/${getProjectSlug(project.title)}`,
			description: project.description,
			guid: `${BASE_URL}/projects/${getProjectSlug(project.title)}`,
		})),
	];

	const itemXml = items
		.map(
			(item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="true">${escapeXml(item.guid)}</guid>
      <pubDate>${lastBuildDate}</pubDate>
      <description>${escapeXml(item.description)}</description>
    </item>`,
		)
		.join("\n");

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${profile.name} — Portfolio`)}</title>
    <link>${BASE_URL}</link>
    <description>${escapeXml(`Pages and projects by ${profile.name}, ${profile.tagline.replace(/\s*\|\s*/, " and ")} based in ${profile.location}.`)}</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${itemXml}
  </channel>
</rss>
`;

	return new Response(xml, {
		status: 200,
		headers: {
			"Content-Type": "application/rss+xml; charset=utf-8",
			"Cache-Control": "public, max-age=3600, s-maxage=86400",
		},
	});
}
