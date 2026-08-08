import {
	SiC,
	SiCelery,
	SiCplusplus,
	SiDocker,
	SiFastapi,
	SiGit,
	SiGooglecloud,
	SiJavascript,
	SiNeo4J,
	SiNextdotjs,
	SiNodedotjs,
	SiOpencv,
	SiPostgresql,
	SiPython,
	SiPytorch,
	SiReact,
	SiRedis,
	SiSupabase,
	SiTypescript,
} from "react-icons/si";

type SkillItem = {
	name: string;
	icon: React.ReactNode;
};

const skills: SkillItem[] = [
	{ name: "Python", icon: <SiPython /> },
	{ name: "TypeScript", icon: <SiTypescript /> },
	{ name: "JavaScript", icon: <SiJavascript /> },
	{ name: "C", icon: <SiC /> },
	{ name: "C++", icon: <SiCplusplus /> },
	{ name: "FastAPI", icon: <SiFastapi /> },
	{ name: "Next.js", icon: <SiNextdotjs /> },
	{ name: "Node.js", icon: <SiNodedotjs /> },
	{ name: "React", icon: <SiReact /> },
	{ name: "PyTorch", icon: <SiPytorch /> },
	{ name: "PostgreSQL", icon: <SiPostgresql /> },
	{ name: "Redis", icon: <SiRedis /> },
	{ name: "Docker", icon: <SiDocker /> },
	{ name: "Supabase", icon: <SiSupabase /> },
	{ name: "Git", icon: <SiGit /> },
	{
		name: "AWS S3",
		icon: <span className="text-[0.6875rem] font-bold uppercase">S3</span>,
	},
	{ name: "GCP", icon: <SiGooglecloud /> },
	{ name: "Neo4j", icon: <SiNeo4J /> },
	{ name: "Celery", icon: <SiCelery /> },
	{ name: "OpenCV", icon: <SiOpencv /> },
];

export default function MobileSkillStrip() {
	const duplicated = [...skills, ...skills, ...skills];

	return (
		<div className="flex marquee gap-3 items-center">
			{duplicated.map((skill, i) => (
				<div
					key={`${skill.name}-${i}`}
					className="flex items-center justify-center w-10 h-10 shrink-0 bg-background border-[2px] border-border shadow-sm text-foreground text-xl"
					aria-label={skill.name}
				>
					{skill.icon}
				</div>
			))}
		</div>
	);
}
