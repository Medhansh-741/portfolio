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
  { name: "AWS S3", icon: <span className="text-[11px] font-bold uppercase tracking-wider text-[#6A784D]">S3</span> },
  { name: "GCP", icon: <SiGooglecloud /> },
  { name: "Neo4j", icon: <SiNeo4J /> },
  { name: "Celery", icon: <SiCelery /> },
  { name: "OpenCV", icon: <SiOpencv /> },
];

export default function SkillStrip() {
  const duplicated = [...skills, ...skills, ...skills];

  return (
    <div className="w-full overflow-hidden border-y border-[#6A784D]/20 bg-[#F4EFE6] py-5">
      <div className="flex marquee gap-10 items-center">
        {duplicated.map((skill, i) => (
          <div
            key={`${skill.name}-${i}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FCF9F2] border border-[#6A784D]/15 shadow-sm whitespace-nowrap"
          >
            <span className="text-[#6A784D] text-lg">{skill.icon}</span>
            <span className="text-xs font-semibold text-[#33432B]">{skill.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
