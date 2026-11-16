import type { Metadata } from "next";
import { getOpenSourceStats, type OpenSourceStats, type Pull, type UpstreamProject } from "@/app/lib/open-source";
import { Icon } from "@/components/icon";
import { LcdNumber, PrIcon } from "@/components/pr";
import { Shell } from "@/components/shell";
import { formatPullDate } from "@/lib/images";
import { profile, staticRoutes } from "@portfolio/data";

const route = staticRoutes.find((r) => r.path === "/open-source");
const pageTitle = `Open Source — ${profile.name}`;
const pageDescription = route?.description ?? `Open-source contributions by ${profile.name} to upstream community projects.`;
const preview = {
	url: "/og/open-source.png",
	width: 1200,
	height: 630,
	alt: `Open Source contributions by ${profile.name}`,
};

export const metadata: Metadata = {
	title: "Open Source", // the root layout's template appends " | <name>"
	description: pageDescription,
	alternates: { canonical: "/open-source" },
	openGraph: { title: pageTitle, description: pageDescription, url: "/open-source", type: "website", images: [preview] },
	twitter: { card: "summary_large_image", title: pageTitle, description: pageDescription, images: [preview] },
};

// GitHub's own wording, octicons and Primer state colours for everything pull-request related.
const STATE_LABEL: Record<Pull["state"], string> = { merged: "Merged", open: "Open", closed: "Closed" };
const n = (value: number) => value.toLocaleString("en-US");
const lede = "mb-4 text-[0.9375rem] text-muted";
const meta = "text-[0.8125rem] text-muted";

function Totals({ stats }: { stats: OpenSourceStats }) {
	const states = [
		["merged", stats.merged],
		["open", stats.open],
		["closed", stats.closed],
	] as const;
	return (
		<section aria-label="Totals" className="border border-line p-3">
			<p className="flex flex-wrap items-center gap-x-5 gap-y-[0.35rem] text-[0.875rem] text-muted">
				{states
					.filter(([, count]) => count > 0)
					.map(([state, count]) => (
						<span key={state} className="inline-flex items-center gap-[0.4rem] whitespace-nowrap">
							<PrIcon state={state} />
							<LcdNumber value={count} /> {STATE_LABEL[state]}
						</span>
					))}
			</p>
		</section>
	);
}

function PullRow({ pull }: { pull: Pull }) {
	return (
		<li className="grid grid-cols-[1rem_minmax(0,1fr)] gap-[0.6rem] border-line-soft py-[0.65rem] text-[0.9rem] not-first:border-t">
			<PrIcon state={pull.state} className="mt-[0.15rem] block size-4 flex-none" />
			<div className="grid min-w-0 gap-[0.2rem] [overflow-wrap:anywhere]">
				<a href={pull.url}>{pull.title}</a>
				<span className={meta}>
					{[
						STATE_LABEL[pull.state],
						`#${pull.number}`,
						formatPullDate(pull.date),
						`+${n(pull.additions)} −${n(pull.deletions)}`,
						`${pull.files} file${pull.files === 1 ? "" : "s"}`,
					].join(" · ")}
				</span>
				{pull.note && <p className="text-[0.8125rem]">{pull.note}</p>}
			</div>
		</li>
	);
}

// Each repo starts collapsed to one row; opened, its PR list scrolls inside a fixed height.
function Repo({ p }: { p: UpstreamProject }) {
	return (
		<details data-oss-repo className="group border border-line">
			<summary className="grid min-h-[3.5rem] list-none grid-cols-[1.5rem_minmax(0,1fr)_1.5rem_1rem] items-center gap-[0.6rem] px-3 py-2 hover:bg-hover-soft">
				<img src={p.avatar} alt="" width={24} height={24} className="block size-6 rounded-[0.25rem]" />
				<span className="grid min-w-0 gap-[0.2rem]">
					<strong className="truncate text-[0.9375rem]">{p.project}</strong>
					<span className="text-[0.8125rem] leading-[1.4] text-ink">{p.about}</span>
					<span className={meta}>★ {n(p.stars)}</span>
				</span>
				<span className="text-end text-muted tabular-nums">{p.pulls.length}</span>
				<Icon
					name="chevron"
					className="size-4 transition-[rotate] duration-[160ms] ease-[ease-out] group-open:rotate-180 motion-reduce:transition-none"
				/>
			</summary>
			<div
				tabIndex={0}
				role="region"
				aria-label={`${p.project} pull requests`}
				className="mx-3 max-h-[17rem] overflow-y-auto overscroll-contain border-t border-line-soft scrollbar-none"
			>
				<ol className="m-0 list-none p-0">
					{p.pulls.map((pull) => (
						<PullRow key={pull.number} pull={pull} />
					))}
				</ol>
			</div>
			<a
				href={p.url}
				aria-label={`${p.project} repository on GitHub`}
				className="mx-3 flex min-h-tap items-center gap-[0.3rem] border-t border-line-soft text-[0.8125rem]"
			>
				View on GitHub <Icon name="external" className="size-[0.9rem]" />
			</a>
		</details>
	);
}

export default async function OpenSourcePage() {
	const stats = await getOpenSourceStats();
	return (
		<Shell page="open-source">
			<h1 className="mb-4">Open Source</h1>
			<p className={lede}>Pull requests to upstream community projects. Team and hackathon repos are not counted.</p>
			{stats && stats.projects.length > 0 ? (
				<>
					<Totals stats={stats} />
					<section className="mt-6">
						<h2 className="mb-[0.625rem]">Projects</h2>
						<div className="grid gap-[0.625rem]">
							{stats.projects.map((p) => (
								<Repo key={p.repo} p={p} />
							))}
						</div>
					</section>
				</>
			) : (
				<p className={lede}>
					The contribution list couldn&apos;t be loaded right now. <a href={profile.github}>See GitHub</a>.
				</p>
			)}
		</Shell>
	);
}
