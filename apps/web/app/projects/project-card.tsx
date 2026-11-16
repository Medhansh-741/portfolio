import Link from "next/link";
import { getProjectSlug, type Project } from "@portfolio/data";
import { Demo } from "@/components/demo";
import { Icon } from "@/components/icon";
import { MentionsDialog, MentionsTrigger } from "@/components/mentions";

const actionLink = "inline-flex min-h-tap min-w-tap items-center justify-center hover:bg-hover";

export function ProjectCard({ project, detailed = false, lazyDemo }: { project: Project; detailed?: boolean; lazyDemo?: boolean }) {
	const slug = getProjectSlug(project.title);
	const Heading = detailed ? "h1" : "h2";
	const announcement = detailed && slug === "jansamadhan" ? project.mentions?.[0] : undefined;
	return (
		<article
			id={slug}
			aria-labelledby={`${slug}-title`}
			className="grid grid-cols-[minmax(0,1fr)] gap-[0.65rem] border border-line p-[clamp(0.75rem,4vw,1rem)] text-[0.9375rem] [overflow-wrap:anywhere]"
		>
			<div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-[0.625rem]">
				<Heading id={`${slug}-title`}>{detailed ? project.title : <Link href={`/projects/${slug}`}>{project.title}</Link>}</Heading>
				<div className="flex items-center">
					<a className={actionLink} href={project.links.demo} aria-label={`Watch ${project.title} on YouTube`} title="Watch on YouTube">
						<Icon name="youtube" className="size-[1.1rem]" />
					</a>
					<a className={actionLink} href={project.links.github} aria-label={`${project.title} repository on GitHub`}>
						<Icon name="github" className="size-[1.1rem]" />
					</a>
				</div>
			</div>
			<Demo project={project} loading={lazyDemo ? "lazy" : undefined} />
			<p>{project.description}</p>
			{announcement && project.mentionsSummary && (
				<p>
					{project.mentionsSummary}{" "}
					<a className="inline-flex min-h-tap items-center justify-self-start text-[0.875rem] hover:bg-hover" href={announcement.url}>
						Manipal University Jaipur announcement
					</a>
				</p>
			)}
			{project.mentions?.length ? (
				<>
					<MentionsTrigger id={`${slug}-mentions`} dialogId={`${slug}-mentions-dialog`} count={project.mentions.length} />
					<MentionsDialog id={`${slug}-mentions`} title={`${project.title} mentions`} summary={project.mentionsSummary} mentions={project.mentions} />
				</>
			) : null}
		</article>
	);
}
