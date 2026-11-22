import { JsonLd, getProfilePageSchema } from "./lib/jsonld";
import { profile } from "@portfolio/data";
import { getOpenSourceStats, type OpenSourceStats } from "./lib/open-source";
import { getContributions } from "./lib/github";
import { Shell } from "@/components/shell";
import { ExperienceLetters } from "@/components/experience-letters";
import { Icon, type IconName } from "@/components/icon";
import { LcdNumber, PrIcon } from "@/components/pr";
import { Demo } from "@/components/demo";
import { formatPullDate, responsiveImage } from "@/lib/images";
import { Deck, type DeckCard } from "@/components/home/deck";
import { Contributions } from "@/components/home/contributions";

const skillGroups = [
	["Languages", ["Python", "TypeScript", "JavaScript", "SQL", "C/C++"]],
	["Applied AI", ["Multi-agent workflows (LangGraph, tool calling)", "RAG (LangChain, LlamaIndex)", "Hybrid search, reranking & retrieval evaluation"]],
	["Machine Learning", ["PyTorch", "Computer vision (YOLOv8, OpenCV)", "ONNX inference", "Sentence Transformers"]],
	["Frontend", ["React", "Next.js", "HTML/CSS", "Tailwind CSS"]],
	["Backend", ["FastAPI", "Node.js", "REST APIs", "WebSockets", "Celery", "Pydantic"]],
	["Databases", ["PostgreSQL", "Supabase", "Redis", "SQLite", "Qdrant (vector search)", "Neo4j (graph)"]],
	["Deployment", ["Docker / Podman", "Linux (RHEL, Ubuntu)", "Git", "GitHub Actions (CI/CD)"]],
	["Cloud", ["Google Cloud (Cloud Run)", "AWS (S3, Lambda)", "Vercel"]],
	["Data & Geospatial", ["ETL pipelines", "PostGIS", "GDAL", "GeoServer", "Martin Tile Server", "OpenLayers"]],
	["Testing & Performance", ["Playwright", "Lighthouse", "Python CPU and memory profiling", "SQL query-plan analysis"]],
] as const;

const contacts: [string, string, IconName][] = [
	["GitHub", profile.github, "github"],
	["LinkedIn", profile.linkedin, "linkedin"],
	["X", profile.x, "x"],
	["Email", `mailto:${profile.email}`, "email"],
	["Résumé", profile.resumeUrl, "resume"],
	["Book a call", profile.cal, "calendar"],
];

function SkillList({ groups, className = "grid" }: { groups: ReadonlyArray<readonly [string, readonly string[]]>; className?: string }) {
	return (
		<dl className={`gap-[0.48rem] text-[0.8125rem] ${className}`}>
			{groups.map(([label, skills]) => (
				<div key={label} className="grid grid-cols-[minmax(6rem,27%)_minmax(0,1fr)] gap-[0.55rem] max-[19rem]:grid-cols-[minmax(0,1fr)] max-[19rem]:gap-0">
					<dt className="font-[680] [overflow-wrap:anywhere]">{label}</dt>
					<dd className="[overflow-wrap:anywhere]">{skills.join(" · ")}</dd>
				</div>
			))}
		</dl>
	);
}

const bottom = "self-end border-t border-line-soft";
const caption = "mt-[-0.15rem] mb-[0.65rem] text-[0.8125rem] text-muted";
const footerHeading = "text-[0.875rem] leading-[1.3] [overflow-wrap:anywhere]";

const projectCards: DeckCard[] = profile.projects.map((project, index) => ({
	category: "projects",
	title: project.title,
	footerTitle: (
		<div className="flex min-w-0 items-center">
			<h2 className={footerHeading}>{project.title}</h2>
			<a href={project.links.github} aria-label={`${project.title} repository on GitHub`} className="inline-flex min-h-tap min-w-tap shrink-0 items-center justify-center">
				<Icon name="github" className="pointer-events-none size-[1.1rem]" />
			</a>
		</div>
	),
	content: (
		<>
			<p className="mb-3 text-[0.9375rem] leading-[1.3] font-[660]">{project.subtitle}</p>
			<Demo project={project} priority={index ? "low" : "high"} className="self-center" />
		</>
	),
}));

const experienceCards: DeckCard[] = profile.experience.map((item) => ({
	category: "experience",
	title: item.company,
	footerTitle: <h2 className={footerHeading}>{item.homeTitle ?? item.company}</h2>,
	content: (
		<div className="grid min-w-0 content-around gap-y-2">
			<div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
				<p className="text-[clamp(1.125rem,4.6cqi,1.375rem)] leading-tight font-[700] tracking-[-0.02em]">{item.role}</p>
				<p className="text-[0.8125rem] text-muted">{item.period}</p>
			</div>
			<ExperienceLetters company={item.company} offerLetter={item.offerLetter} completionLetter={item.completionLetter} />
			<p className="text-[clamp(1rem,3.9cqi,1.0625rem)] leading-normal">{item.summary}</p>
		</div>
	),
}));

const achievementCards: DeckCard[] = profile.achievements.flatMap(({ title, homeTitle, homeImage, images }) => {
	const photo = homeImage ?? images?.[0];
	if (!photo) return [];
	return [{
		category: "achievements",
		title,
		footerTitle: <h2 className={footerHeading}>{homeTitle ?? title}</h2>,
		content: (
			<>
				<img
					src={photo.src}
					{...responsiveImage(photo.src, photo.width)}
					alt={photo.alt}
					width={photo.width}
					height={photo.height}
					loading="lazy"
					className="block aspect-video h-auto min-h-[200px] w-full self-center object-contain"
				/>
			</>
		),
	}];
});

// One glanceable card for the deck's "Open Source" tab; the full breakdown lives on /open-source.
function openSourceCard(stats: OpenSourceStats | null): DeckCard {
	const header = <h2 className="flex min-h-tap items-center [overflow-wrap:anywhere]">Open Source</h2>;
	if (!stats || stats.projects.length === 0) {
		return {
			category: "oss",
			title: "Open Source",
			content: (
				<>
					{header}
					<p className={caption}>Contributions to upstream community projects.</p>
				</>
			),
		};
	}

	const orgs = new Map<string, { avatar: string; merged: number; open: number }>();
	for (const p of stats.projects) {
		const org = orgs.get(p.org) ?? { avatar: p.avatar, merged: 0, open: 0 };
		org.merged += p.merged;
		org.open += p.open;
		orgs.set(p.org, org);
	}
	// Every org is listed; the list scrolls inside the card, so new orgs appear without growing the deck.
	const sorted = [...orgs.entries()].sort(([, a], [, b]) => b.merged - a.merged || b.open - a.open);
	const latest = stats.latestMerge;

	// GitHub's own language: state octicons in Primer colours.
	return {
		category: "oss",
		title: "Open Source",
		content: (
			<>
				{header}
				<p className="m-0 mb-[0.6rem] flex flex-wrap items-center gap-x-5 gap-y-[0.35rem] text-[0.875rem] text-muted">
					<span className="inline-flex items-center gap-[0.4rem] whitespace-nowrap">
						<PrIcon state="merged" />
						<LcdNumber value={stats.merged} /> Merged
					</span>
					<span className="inline-flex items-center gap-[0.4rem] whitespace-nowrap">
						<PrIcon state="open" />
						<LcdNumber value={stats.open} /> Open
					</span>
				</p>
				{/* rows share the middle space evenly; when they outgrow it the list scrolls with no visible scrollbar */}
				<ul
					tabIndex={0}
					aria-label="Organizations contributed to"
					className="m-0 grid min-h-0 list-none auto-rows-fr grid-cols-[1.25rem_minmax(0,1fr)_1.5rem] gap-x-[0.6rem] overflow-y-auto overscroll-contain p-0 text-[0.875rem] scrollbar-none focus-visible:outline-offset-[-2px]"
				>
					{sorted.map(([name, { avatar, merged, open }]) => (
						<li key={name} className="col-span-full grid min-h-8 grid-cols-subgrid items-center gap-[0.6rem] border-t border-line-soft">
							<img src={avatar} alt="" width={20} height={20} className="block size-5 rounded-[0.2rem]" />
							<span className="truncate">{name}</span>
							<span className="text-end text-muted tabular-nums">{merged + open}</span>
						</li>
					))}
				</ul>
				{latest && (
					<p className={`m-0 truncate pt-[0.55rem] pb-[0.45rem] text-[0.8125rem] text-muted ${bottom}`}>
						<PrIcon state="merged" className="me-[0.35rem] inline-block size-[0.9rem] flex-none align-[-0.15rem]" />
						Latest: <a href={latest.url}>{`${latest.org} #${latest.number}`}</a>{` · ${formatPullDate(latest.date).replace(/, \d{4}$/, "")}`}
					</p>
				)}
			</>
		),
	};
}

export default async function Home() {
	const [openSource, contributions] = await Promise.all([getOpenSourceStats(), getContributions()]);
	return (
		<>
			<JsonLd data={getProfilePageSchema("", `${profile.name} | ${profile.tagline}`)} />
			<Shell page="home">
				<section aria-label="Profile" className="@container pt-3 pb-1">
					<p className="text-[0.9375rem] font-[570] text-balance">{profile.tagline}</p>
					<ul
						aria-label="Contact and profiles"
						className="m-0 flex list-none justify-start gap-[clamp(0.625rem,calc((100cqi_-_17.5rem)/6),0.95rem)] p-0 text-[0.875rem] whitespace-nowrap @max-[21rem]:grid @max-[21rem]:auto-cols-[minmax(0,1fr)] @max-[21rem]:grid-flow-col @max-[21rem]:gap-0"
					>
						{contacts.map(([label, href, symbol]) => (
							<li key={label}>
								<a href={href} aria-label={label} className="inline-flex min-h-tap items-center @max-[21rem]:w-full @max-[21rem]:justify-center">
									<span className="@max-[21rem]:hidden">{label}</span>
									<Icon name={symbol} className="hidden @max-[21rem]:block @max-[21rem]:h-[1.125rem] @max-[21rem]:w-[min(100%,1.125rem)]" />
								</a>
							</li>
						))}
					</ul>
				</section>
				<section aria-label="Technical skills" className="border-y border-line py-[0.65rem]">
					<SkillList groups={skillGroups.slice(0, 2)} />
					<details data-more-skills className="group grid">
						<summary className="order-1 inline-flex min-h-tap list-none items-center gap-1 justify-self-start text-[0.8125rem] underline underline-offset-[0.2em]">
							<span className="group-open:hidden">Show all skills</span>
							<span className="hidden group-open:inline">Show fewer skills</span>
							<Icon name="chevron" className="size-[0.9rem] group-open:rotate-180" />
						</summary>
						<SkillList groups={skillGroups.slice(2)} className="mt-[0.48rem] hidden group-open:grid" />
					</details>
				</section>
				<Deck cards={[...projectCards, ...experienceCards, ...achievementCards, openSourceCard(openSource)]} />
				<Contributions graph={contributions} github={profile.github} />
			</Shell>
		</>
	);
}
