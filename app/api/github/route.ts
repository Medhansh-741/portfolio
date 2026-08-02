import { NextResponse } from "next/server";
import type { ContributionDay } from "@/app/lib/schemas";
import { GithubReposArraySchema, GithubUserSchema } from "@/app/lib/schemas";

export const revalidate = 3600; // Cache on server for 1 hour

const LANG_COLORS: Record<string, string> = {
	Python: "var(--color-accent-secondary)",
	TypeScript: "var(--color-accent-warning)",
	"C++": "var(--color-accent)",
	JavaScript: "#f1e05a",
	Java: "#b07219",
	Go: "#00ADD8",
	Rust: "#dea584",
	HTML: "#e34c26",
	CSS: "#563d7c",
};

const LANG_SHORT: Record<string, string> = {
	Python: "PY",
	TypeScript: "TS",
	"C++": "C++",
	JavaScript: "JS",
	Java: "JAVA",
	Go: "GO",
	Rust: "RS",
};

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

	try {
		const currentYear = new Date().getFullYear();
		const prevYear = currentYear - 1;
		const query = `
      query($userName:String!) {
        user(login: $userName) {
          current: contributionsCollection(from: "${currentYear}-01-01T00:00:00Z", to: "${currentYear}-12-31T23:59:59Z") {
            contributionCalendar {
              totalContributions
              weeks { contributionDays { contributionCount date } }
            }
          }
          previous: contributionsCollection(from: "${prevYear}-01-01T00:00:00Z", to: "${prevYear}-12-31T23:59:59Z") {
            contributionCalendar {
              totalContributions
              weeks { contributionDays { contributionCount date } }
            }
          }
        }
      }
    `;

		const [graphqlRes, userRes, reposRes] = await Promise.allSettled([
			fetch("https://api.github.com/graphql", {
				method: "POST",
				next: { revalidate: 3600 },
				headers: {
					...authHeaders,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ query, variables: { userName: username } }),
			}),
			fetch(`https://api.github.com/users/${username}`, {
				next: { revalidate: 3600 },
				headers: authHeaders,
			}),
			fetch(
				`https://api.github.com/users/${username}/repos?per_page=100&type=owner`,
				{
					next: { revalidate: 3600 },
					headers: authHeaders,
				},
			),
		]);

		const contribData = {
			total: {} as Record<string, number>,
			contributions: [] as ContributionDay[],
		};

		if (graphqlRes.status === "fulfilled" && graphqlRes.value.ok) {
			const json = await graphqlRes.value.json();
			const collections = json?.data?.user;

			if (collections) {
				const getLevel = (count: number) => {
					if (count === 0) return 0;
					if (count <= 3) return 1;
					if (count <= 6) return 2;
					if (count <= 9) return 3;
					return 4;
				};

				const processCalendar = (
					calendarInfo:
						| {
								totalContributions: number;
								weeks: {
									contributionDays: {
										contributionCount: number;
										date: string;
									}[];
								}[];
						  }
						| null
						| undefined,
					yearStr: string,
				) => {
					if (!calendarInfo) return;
					contribData.total[yearStr] = calendarInfo.totalContributions;

					for (const week of calendarInfo.weeks) {
						for (const day of week.contributionDays) {
							// Only push days up to today to match normal behavior
							const todayStr = new Date().toISOString().split("T")[0];
							if (day.date <= todayStr || yearStr === prevYear.toString()) {
								contribData.contributions.push({
									date: day.date,
									count: day.contributionCount,
									level: getLevel(day.contributionCount),
								});
							} else if (day.date > todayStr) {
								// Include future days as empty so the skeleton renders a full grid
								contribData.contributions.push({
									date: day.date,
									count: 0,
									level: 0,
								});
							}
						}
					}
				};

				processCalendar(
					collections.current?.contributionCalendar,
					currentYear.toString(),
				);
				processCalendar(
					collections.previous?.contributionCalendar,
					prevYear.toString(),
				);
			}
		}

		let publicRepos = 14;
		if (userRes.status === "fulfilled" && userRes.value.ok) {
			const rawJson = await userRes.value.json();
			const parsed = GithubUserSchema.safeParse(rawJson);
			if (parsed.success && typeof parsed.data.public_repos === "number") {
				publicRepos = parsed.data.public_repos;
			}
		}

		let totalStars = 24;
		const langCounts: Record<string, number> = {};

		if (reposRes.status === "fulfilled" && reposRes.value.ok) {
			const rawJson = await reposRes.value.json();
			const parsed = GithubReposArraySchema.safeParse(rawJson);
			if (parsed.success && parsed.data.length > 0) {
				let starsSum = 0;
				parsed.data.forEach((repo) => {
					if (!repo.fork) {
						starsSum += repo.stargazers_count;
						if (repo.language) {
							langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
						}
					}
				});
				totalStars = starsSum;
			}
		}

		// Process top 3 languages
		const totalLangRepos =
			Object.values(langCounts).reduce((a, b) => a + b, 0) || 1;
		const sortedLangs = Object.entries(langCounts)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 3);

		const topLanguages = sortedLangs.map(([name, count], index) => {
			const pct = Math.round((count / totalLangRepos) * 100);
			const defaultColors = [
				"var(--color-accent-secondary)",
				"var(--color-accent-warning)",
				"var(--color-accent)",
			];
			return {
				name,
				shortName: LANG_SHORT[name] || name.substring(0, 4).toUpperCase(),
				percentage: pct,
				color: LANG_COLORS[name] || defaultColors[index % defaultColors.length],
			};
		});

		// Fallback if no language data was returned
		if (topLanguages.length === 0) {
			topLanguages.push(
				{
					name: "Python",
					shortName: "PY",
					percentage: 65,
					color: "var(--color-accent-secondary)",
				},
				{
					name: "TypeScript",
					shortName: "TS",
					percentage: 25,
					color: "var(--color-accent-warning)",
				},
				{
					name: "C++",
					shortName: "C++",
					percentage: 10,
					color: "var(--color-accent)",
				},
			);
		}

		const payload = {
			...contribData,
			stats: {
				publicRepos,
				totalStars,
				topLanguages,
			},
		};

		return NextResponse.json(payload, {
			headers: {
				"Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
			},
		});
	} catch (error) {
		console.error("Error in GitHub proxy:", error);
		return NextResponse.json(
			{ error: "Failed to fetch GitHub data" },
			{ status: 500 },
		);
	}
}
