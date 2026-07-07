"use client";

import {
  SiPython, SiTypescript, SiJavascript, SiC, SiCplusplus,
  SiFastapi, SiNextdotjs, SiNodedotjs, SiReact,
  SiPytorch, SiPostgresql, SiRedis, SiDocker,
  SiSupabase, SiGit, SiGooglecloud,
  SiNeo4J, SiCelery, SiOpencv,
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
  { name: "AWS S3", icon: <span className="text-[11px] font-bold uppercase">S3</span> },
  { name: "GCP", icon: <SiGooglecloud /> },
  { name: "Neo4j", icon: <SiNeo4J /> },
  { name: "Celery", icon: <SiCelery /> },
  { name: "OpenCV", icon: <SiOpencv /> },
];

export default function SkillStrip() {
  const duplicated = [...skills, ...skills, ...skills];

  return (
    <div className="w-full overflow-hidden border-y-[3px] border-border bg-muted py-3">
      <div className="flex marquee gap-6 items-center">
        {duplicated.map((skill, i) => (
          <div
            key={`${skill.name}-${i}`}
            className="flex items-center gap-2 px-4 py-2 bg-background border-[2px] border-border shadow-sm whitespace-nowrap"
          >
            <span className="text-foreground text-lg">{skill.icon}</span>
            <span className="text-xs font-bold text-foreground uppercase tracking-wider">{skill.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
