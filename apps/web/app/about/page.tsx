import type { Metadata } from "next";
import { Shell } from "@/components/shell";
import { Icon } from "@/components/icon";
import { Gallery } from "@/components/about/gallery";
import { MentionsDialog, MentionsTrigger } from "@/components/mentions";
import { responsiveImage } from "@/lib/images";
import { JsonLd, getProfilePageSchema } from "@/app/lib/jsonld";
import { getProjectSlug, profile, staticRoutes } from "@portfolio/data";

const aboutRoute = staticRoutes.find((r) => r.path === "/about");
const pageTitle = `About ${profile.name} — Background & Achievements`;
const pageDescription =
	aboutRoute?.description ||
	`Engineering background, technical philosophy, and education of ${profile.name}.`;

export const metadata: Metadata = {
	title: { absolute: pageTitle },
	description: pageDescription,
	alternates: {
		canonical: "/about",
	},
	openGraph: {
		title: pageTitle,
		description: pageDescription,
		url: "/about",
		type: "website",
		images: [
			{
				url: "/og/about-v2.png",
				width: 1200,
				height: 630,
				alt: pageTitle,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: pageTitle,
		description: pageDescription,
		images: ["/og/about-v2.png"],
	},
};

const card = "grid grid-cols-[minmax(0,1fr)] gap-[0.65rem] border border-line p-[clamp(0.75rem,4vw,1rem)] text-[0.9375rem] [overflow-wrap:anywhere]";
const list = "grid grid-cols-[minmax(0,1fr)] gap-[0.875rem]";
const textLink = "inline-flex min-h-tap items-center justify-self-start text-[0.875rem] hover:bg-hover";

type Achievement = (typeof profile.achievements)[number];

function AchievementCard({ achievement, first }: { achievement: Achievement; first: boolean }) {
	const { title, detail, certificate, eventUrl, coverage, projectTitle, images = [] } = achievement;
	const project = projectTitle ? profile.projects.find((p) => p.title === projectTitle) : undefined;
	const mentions = project && "mentions" in project ? project.mentions ?? [] : [];
	const mentionsSummary = project && "mentionsSummary" in project ? project.mentionsSummary : undefined;
	const mentionsId = projectTitle ? `${getProjectSlug(projectTitle)}-mentions` : "";
	const carousel = images.length > 1;
	// The very first photo on the page is the main image (LCP), so it loads first; every other photo waits until
	// it is near the viewport (carousel photos sit off to the side until swiped to).
	const photos = images.map(({ src, alt, width, height }, index) => (
		<img
			key={src}
			src={src}
			{...responsiveImage(src, width)}
			alt={alt}
			width={width}
			height={height}
			draggable={carousel ? false : undefined}
			{...(first && index === 0 ? { fetchPriority: "high" as const } : { loading: "lazy" as const })}
			className={carousel ? "block w-full min-w-0 flex-[0_0_100%] snap-start snap-always object-contain h-full" : "block h-auto w-full"}
		/>
	));

	return (
		<article className={card}>
			<h3 className="m-0 text-[1rem] leading-[1.25]">{title}</h3>
			{detail && <p>{detail}</p>}
			{carousel ? <Gallery label={title} count={images.length}>{photos}</Gallery> : photos}
			{(certificate || mentions.length > 0) && (
				<div className="flex flex-wrap items-center gap-x-3">
					{certificate && (
						<a className={textLink} href={certificate} aria-label={`View certificate for ${title} (PDF)`}>
							View certificate
						</a>
					)}
					{mentions.length > 0 && <MentionsTrigger id={mentionsId} dialogId={`${mentionsId}-dialog`} count={mentions.length} className="ms-auto" />}
				</div>
			)}
			{mentions.length > 0 && (
				<MentionsDialog id={mentionsId} title={`${project?.title ?? title} mentions`} summary={mentionsSummary} mentions={mentions} />
			)}
			{(eventUrl || coverage) && (
				<div className="flex flex-wrap gap-x-3">
					{eventUrl && (
						<a className={textLink} href={eventUrl}>
							View event
						</a>
					)}
					{coverage && (
						<a className={`${textLink} ms-auto text-end`} href={coverage.url}>
							{coverage.label}
						</a>
					)}
				</div>
			)}
		</article>
	);
}

export default function AboutPage() {
	return (
		<>
			<JsonLd data={getProfilePageSchema("/about", pageTitle, pageDescription)} />
			<Shell page="about">
				<h1 className="mb-4">About {profile.name}</h1>
				<div className={card}>
					<p>
						I’m Medhansh Kapoor, an AI/ML engineer and Full-Stack Developer studying Computer Science and Engineering at
						Manipal University Jaipur.
					</p>
				</div>
				<section className="mt-6" aria-labelledby="achievements">
					<h2 id="achievements" className="mb-[0.625rem]">
						Achievements
					</h2>
					<div className={list}>
						{profile.achievements.map((achievement, index) => (
							<AchievementCard key={achievement.title} achievement={achievement} first={index === 0} />
						))}
					</div>
				</section>
				<section className="mt-6" aria-labelledby="education">
					<h2 id="education" className="mb-[0.625rem]">
						Education
					</h2>
					<div className={list}>
						{profile.education.map(({ institution, degree, period }) => (
							<article key={institution} className={card}>
								<h3 className="m-0 text-[1rem] leading-[1.25]">{institution}</h3>
								<div className="grid gap-[0.2rem]">
									<p>{degree}</p>
									<p className="text-[0.8125rem] text-muted">{period}</p>
								</div>
							</article>
						))}
					</div>
				</section>
			</Shell>
		</>
	);
}
