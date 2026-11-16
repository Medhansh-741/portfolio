// Open-source contributions to upstream community projects, fetched live from GitHub.
// Only the repos listed here are counted: team and hackathon repos are deliberately excluded,
// so a new repo never slips into the totals by accident.

const AUTHOR = process.env.GITHUB_USERNAME || "Medhansh-741";

export const UPSTREAM = [
	{ repo: "commons-app/apps-android-commons", project: "Wikimedia Commons Android", org: "Wikimedia Commons" },
	{ repo: "hiero-ledger/hiero-sdk-js", project: "Hiero SDK (JavaScript)", org: "Hiero" },
	{ repo: "hiero-ledger/hiero-sdk-go", project: "Hiero SDK (Go)", org: "Hiero" },
	{ repo: "OWASP/cve-lite-cli", project: "CVE Lite CLI", org: "OWASP" },
	{ repo: "OWASP/Nest", project: "OWASP Nest", org: "OWASP" },
	{ repo: "sugarlabs/musicblocks-v4", project: "Music Blocks v4", org: "Sugar Labs" },
] as const;

// Optional one-line notes, keyed "owner/repo#number". Live data can't say why a PR mattered.
const NOTES: Record<string, string> = {
	"commons-app/apps-android-commons#7317":
		"When captions or depicts fail after the file has uploaded, only those are retried instead of the whole upload.",
	"hiero-ledger/hiero-sdk-js#4770": "Chunk setters can no longer change a transaction after it has been frozen.",
};

export type PullState = "merged" | "open" | "closed";

export interface Pull {
	repo: string;
	number: number;
	title: string;
	url: string;
	state: PullState;
	date: string; // merged date for merged PRs, opened date otherwise (YYYY-MM-DD)
	additions: number;
	deletions: number;
	files: number;
	note?: string;
}

export interface UpstreamProject {
	repo: string;
	project: string;
	org: string;
	url: string;
	stars: number;
	pulls: Pull[];
	merged: number;
	open: number;
}

export interface OpenSourceStats {
	projects: UpstreamProject[];
	merged: number;
	open: number;
	closed: number;
	additions: number;
	deletions: number;
	reviews: number;
	latestMerge?: Pull & { project: string };
}

type GraphPull = {
	number: number;
	title: string;
	url: string;
	state: "MERGED" | "OPEN" | "CLOSED";
	createdAt: string;
	mergedAt: string | null;
	additions: number;
	deletions: number;
	changedFiles: number;
	repository: { nameWithOwner: string; stargazerCount: number };
};

const repoFilter = UPSTREAM.map(({ repo }) => `repo:${repo}`).join(" ");

const QUERY = `
	query($pulls: String!, $reviews: String!) {
		pulls: search(query: $pulls, type: ISSUE, first: 100) {
			nodes {
				... on PullRequest {
					number title url state createdAt mergedAt additions deletions changedFiles
					repository { nameWithOwner stargazerCount }
				}
			}
		}
		reviews: search(query: $reviews, type: ISSUE, first: 1) { issueCount }
	}
`;

/** Returns null when GitHub can't be reached, so pages can show a fallback instead of failing the build. */
export async function getOpenSourceStats(): Promise<OpenSourceStats | null> {
	const token = process.env.GITHUB_TOKEN;
	if (!token) return null; // GitHub's GraphQL API requires a token

	try {
		const res = await fetch("https://api.github.com/graphql", {
			method: "POST",
			headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "User-Agent": "Portfolio-App" },
			body: JSON.stringify({
				query: QUERY,
				variables: {
					pulls: `is:pr author:${AUTHOR} ${repoFilter}`,
					reviews: `is:pr reviewed-by:${AUTHOR} -author:${AUTHOR} ${repoFilter}`,
				},
			}),
			next: { revalidate: 21600 }, // 6 hours
		});
		if (!res.ok) return null;
		const json = await res.json();
		const nodes: GraphPull[] = json?.data?.pulls?.nodes ?? [];
		const reviews: number = json?.data?.reviews?.issueCount ?? 0;
		return summarise(nodes, reviews);
	} catch {
		return null;
	}
}

export function summarise(nodes: GraphPull[], reviews: number): OpenSourceStats {
	const projects: UpstreamProject[] = UPSTREAM.map(({ repo, project, org }) => {
		const mine = nodes.filter((n) => n.repository?.nameWithOwner?.toLowerCase() === repo.toLowerCase());
		const pulls: Pull[] = mine
			.map((n) => {
				const state: PullState = n.state === "MERGED" ? "merged" : n.state === "OPEN" ? "open" : "closed";
				return {
					repo,
					number: n.number,
					title: n.title,
					url: n.url,
					state,
					date: (n.mergedAt ?? n.createdAt).slice(0, 10),
					additions: n.additions,
					deletions: n.deletions,
					files: n.changedFiles,
					note: NOTES[`${repo}#${n.number}`],
				};
			})
			.sort((a, b) => b.date.localeCompare(a.date) || b.number - a.number);
		return {
			repo,
			project,
			org,
			url: `https://github.com/${repo}`,
			stars: mine[0]?.repository.stargazerCount ?? 0,
			pulls,
			merged: pulls.filter((p) => p.state === "merged").length,
			open: pulls.filter((p) => p.state === "open").length,
		};
	})
		.filter((p) => p.pulls.length > 0)
		.sort((a, b) => b.merged - a.merged || b.open - a.open || b.stars - a.stars);

	const all = projects.flatMap((p) => p.pulls.map((pull) => ({ ...pull, project: p.project })));
	const merged = all.filter((p) => p.state === "merged");
	const latestMerge = [...merged].sort((a, b) => b.date.localeCompare(a.date))[0];

	return {
		projects,
		merged: merged.length,
		open: all.filter((p) => p.state === "open").length,
		closed: all.filter((p) => p.state === "closed").length,
		additions: merged.reduce((sum, p) => sum + p.additions, 0),
		deletions: merged.reduce((sum, p) => sum + p.deletions, 0),
		reviews,
		latestMerge,
	};
}

/** Merged and opened PRs per week (Monday start), oldest first. */
export function weeklyActivity(stats: OpenSourceStats) {
	const weeks = new Map<string, { merged: number; opened: number }>();
	for (const pull of stats.projects.flatMap((p) => p.pulls)) {
		const d = new Date(`${pull.date}T00:00:00Z`);
		d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
		const key = d.toISOString().slice(0, 10);
		const week = weeks.get(key) ?? { merged: 0, opened: 0 };
		if (pull.state === "merged") week.merged++;
		else if (pull.state === "open") week.opened++;
		weeks.set(key, week);
	}
	return [...weeks.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([week, counts]) => ({ week, ...counts }));
}
