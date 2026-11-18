import { profile } from "@portfolio/data";

export type ContributionDay = { date: string; count: number; level: number };
export type ContributionGraph = { year: number; total: number; days: ContributionDay[] };

const level = (count: number) => (count === 0 ? 0 : count <= 3 ? 1 : count <= 6 ? 2 : count <= 9 ? 3 : 4);

/** This year's GitHub contribution calendar (refreshed hourly); null when GitHub can't be reached. */
export async function getContributions(): Promise<ContributionGraph | null> {
	const token = process.env.GITHUB_TOKEN;
	if (!token) return null; // GitHub's GraphQL API requires a token

	const today = new Date().toISOString().slice(0, 10);
	const year = Number(today.slice(0, 4));
	try {
		const res = await fetch("https://api.github.com/graphql", {
			method: "POST",
			headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "User-Agent": "Portfolio-App" },
			body: JSON.stringify({
				query: `query($login: String!, $from: DateTime!, $to: DateTime!) {
					user(login: $login) { contributionsCollection(from: $from, to: $to) { contributionCalendar {
						totalContributions weeks { contributionDays { contributionCount date } }
					} } }
				}`,
				variables: {
					login: process.env.GITHUB_USERNAME ?? profile.github.split("/").pop(),
					from: `${year}-01-01T00:00:00Z`,
					to: `${year}-12-31T23:59:59Z`,
				},
			}),
			next: { revalidate: 3600 },
		});
		if (!res.ok) return null;
		const calendar = (await res.json())?.data?.user?.contributionsCollection?.contributionCalendar;
		if (!Number.isInteger(calendar?.totalContributions)) return null;
		const days: ContributionDay[] = calendar.weeks
			.flatMap((week: { contributionDays: { contributionCount: number; date: string }[] }) => week.contributionDays)
			.filter(({ date }: { date: string }) => date.startsWith(`${year}-`) && date <= today)
			.map(({ date, contributionCount }: { date: string; contributionCount: number }) => ({ date, count: contributionCount, level: level(contributionCount) }));
		return days.length ? { year, total: calendar.totalContributions, days } : null;
	} catch {
		return null;
	}
}
