import { NextResponse } from "next/server";
import { GithubEventsArraySchema } from "@/app/lib/schemas";

export const revalidate = 300; // Cache on server for 5 minutes

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const username =
		searchParams.get("username") ||
		process.env.GITHUB_USERNAME ||
		"Medhansh-741";
	const token = process.env.GITHUB_TOKEN;

	const authHeaders: Record<string, string> = {
		"User-Agent": "Portfolio-App",
		Accept: "application/vnd.github.v3+json",
	};
	if (token) {
		authHeaders["Authorization"] = `Bearer ${token}`;
	}

	// 1. Try Authenticated GitHub REST Events API first
	try {
		const eventsRes = await fetch(
			`https://api.github.com/users/${username}/events/public`,
			{
				next: { revalidate: 300 },
				headers: authHeaders,
			},
		);

		if (eventsRes.ok) {
			const rawJson = await eventsRes.json();
			const parsed = GithubEventsArraySchema.safeParse(rawJson);

			if (parsed.success && parsed.data.length > 0) {
				const commitsList: Array<{
					id: string;
					repo: string;
					message: string;
					date: string;
					link: string;
				}> = [];

				for (const event of parsed.data) {
					if (commitsList.length >= 12) break;

					if (event.type === "PushEvent" && event.payload?.commits) {
						for (const commit of event.payload.commits) {
							if (commitsList.length >= 12) break;
							if (commit.message) {
								const sha =
									commit.sha || Math.random().toString(36).substring(2, 8);
								const repoName = event.repo.name || `${username}/repository`;
								commitsList.push({
									id: `${event.id}-${sha}`,
									repo: repoName,
									message: commit.message.split("\n")[0].trim(),
									date: event.created_at,
									link: `https://github.com/${repoName}/commit/${sha}`,
								});
							}
						}
					}
				}

				if (commitsList.length > 0) {
					return NextResponse.json(commitsList, {
						headers: {
							"Cache-Control":
								"public, s-maxage=300, stale-while-revalidate=60",
						},
					});
				}
			}
		}
	} catch (err) {
		console.warn(
			"GitHub REST Events API fetch failed, falling back to Atom XML feed:",
			err,
		);
	}

	// 2. Fallback to GitHub Public Atom RSS Feed if REST API is empty/unreachable
	try {
		const atomUrl = `https://github.com/${username}.atom`;
		const response = await fetch(atomUrl, {
			next: { revalidate: 300 },
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
			},
		});

		if (!response.ok) {
			return NextResponse.json(
				{ error: `GitHub Atom feed returned status: ${response.status}` },
				{ status: response.status },
			);
		}

		const xml = await response.text();
		const commitsList: Array<{
			id: string;
			repo: string;
			message: string;
			date: string;
			link: string;
		}> = [];

		const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
		let match;

		const decodeHtml = (str: string) => {
			return str
				.replace(/&lt;/g, "<")
				.replace(/&gt;/g, ">")
				.replace(/&quot;/g, '"')
				.replace(/&amp;/g, "&")
				.replace(/&#39;/g, "'");
		};

		while ((match = entryRegex.exec(xml)) !== null && commitsList.length < 12) {
			const entry = match[1];
			const dateMatch = /<published>([^<]+)<\/published>/.exec(entry);
			const date = dateMatch ? dateMatch[1] : new Date().toISOString();

			const titleMatch =
				/<title type="html">[^ ]+ pushed ([^<]+)<\/title>/.exec(entry);
			let repoName = titleMatch ? titleMatch[1].trim() : "";
			if (repoName && !repoName.includes("/")) {
				repoName = `${username}/${repoName}`;
			}

			const contentMatch = /<content type="html">([\s\S]*?)<\/content>/.exec(
				entry,
			);
			if (contentMatch) {
				const decodedHtml = decodeHtml(contentMatch[1]);
				const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/g;
				let liMatch;
				let entryCommitsCount = 0;

				while (
					(liMatch = liRegex.exec(decodedHtml)) !== null &&
					commitsList.length < 12
				) {
					const msgMatch = /<blockquote>([\s\S]*?)<\/blockquote>/.exec(
						liMatch[1],
					);
					const msg = msgMatch ? msgMatch[1].trim().replace(/\s+/g, " ") : "";

					if (msg) {
						const commitLinkMatch = /href="([^"]*\/commit\/[^"]*)"/.exec(
							liMatch[1],
						);
						const relativeLink = commitLinkMatch ? commitLinkMatch[1] : "";
						const absoluteLink = relativeLink
							? `https://github.com${relativeLink}`
							: `https://github.com/${repoName}`;

						commitsList.push({
							id: `${date}-${entryCommitsCount}-${Math.random().toString(36).substring(2, 7)}`,
							repo: repoName || "GitHub Repository",
							message: msg,
							date: date,
							link: absoluteLink,
						});
						entryCommitsCount++;
					}
				}
			}
		}

		return NextResponse.json(commitsList, {
			headers: {
				"Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
			},
		});
	} catch (error) {
		console.error("Error in GitHub activity proxy:", error);
		return NextResponse.json(
			{ error: "Failed to fetch commit activity" },
			{ status: 500 },
		);
	}
}
