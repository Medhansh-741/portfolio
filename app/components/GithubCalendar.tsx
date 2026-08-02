"use client";
import type {
	GithubData,
	LeetCodeApiResponse,
	NormalizedCodeforcesDto,
} from "@/app/lib/schemas";
import { useClientData } from "@/app/lib/use-client-data";
import GithubCalendarUI from "./GithubCalendarUI";

export default function GithubCalendar() {
	const github = useClientData<GithubData>("/api/github");
	const leetcode = useClientData<LeetCodeApiResponse>("/api/leetcode");
	const codeforces = useClientData<NormalizedCodeforcesDto>("/api/codeforces");
	if (github.loading || leetcode.loading || codeforces.loading)
		return <GithubCalendarSkeleton />;
	return (
		<GithubCalendarUI
			githubData={
				github.data ?? {
					total: {},
					contributions: [],
					stats: { publicRepos: 0, totalStars: 0, topLanguages: [] },
				}
			}
			leetcodeData={leetcode.data?.calendar || {}}
			codeforcesData={codeforces.data?.calendar || {}}
		/>
	);
}

export function GithubCalendarSkeleton() {
	return (
		<div className="w-full h-full p-6 flex flex-col bg-background/50 border-2 border-muted/20 animate-pulse">
			<div className="flex items-center gap-2 mb-4">
				<div className="h-5 w-5 rounded bg-muted/50"></div>
				<div className="h-5 w-32 rounded bg-muted/50"></div>
			</div>
			<div className="flex-1 w-full grid grid-cols-[repeat(auto-fill,minmax(12px,1fr))] gap-1 content-start">
				{Array.from({ length: 60 }).map((_, i) => (
					<div
						key={i}
						className="aspect-square rounded-[2px] bg-muted/30"
					></div>
				))}
			</div>
		</div>
	);
}
