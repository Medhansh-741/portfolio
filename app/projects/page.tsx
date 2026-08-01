"use client";

import { motion } from "framer-motion";
import { FiExternalLink, FiGithub, FiYoutube } from "react-icons/fi";
import { profile } from "@/app/data/profile";
import MagneticWrap from "@/app/components/MagneticWrap";

const stagger = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 120, damping: 14, delay: i * 0.15 },
  }),
};

export default function ProjectsPage() {
  return (
    <main className="flex-1 overflow-y-auto bg-background">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center space-y-2 mb-12">
          <p className="text-xs text-accent font-bold uppercase tracking-widest">What I&apos;ve Built</p>
          <h1 className="font-sans text-4xl md:text-5xl font-black text-foreground uppercase tracking-tight">Projects</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {profile.projects.map((proj, i) => (
            <motion.div
              key={proj.title}
              variants={stagger}
              initial="hidden"
              animate="show"
              custom={i}
              whileHover={{ y: -5 }}
              className="bg-card text-card-foreground border-[3px] border-border shadow-md p-6 md:p-8 flex flex-col cursor-default"
            >
              <div className="mb-4">
                <h2 className="font-sans text-xl font-bold text-foreground uppercase">{proj.title}</h2>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-0.5">{proj.subtitle}</p>
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{proj.period}</span>
              </div>

              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{proj.description}</p>

              {proj.metrics && (
                <div className="mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-accent-warning text-black px-2 py-1">
                    {proj.metrics}
                  </span>
                </div>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                {proj.tech.map((t) => (
                  <span key={t} className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground border-[2px] border-border">
                    {t}
                  </span>
                ))}
              </div>

              <ul className="space-y-2 mb-6 flex-1">
                {proj.highlights.map((h, j) => (
                  <li key={j} className="text-sm text-muted-foreground leading-relaxed pl-4 border-l-[3px] border-border">
                    {h}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-4 pt-4 border-t-[3px] border-border">
                {proj.links.live && (
                  <MagneticWrap>
                    <a href={proj.links.live} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-foreground hover:text-accent-secondary transition-colors">
                      <FiExternalLink size={14} /> Live
                    </a>
                  </MagneticWrap>
                )}
                {proj.links.github && (
                  <MagneticWrap>
                    <a href={proj.links.github} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-foreground hover:text-accent-secondary transition-colors">
                      <FiGithub size={14} /> GitHub
                    </a>
                  </MagneticWrap>
                )}
                {proj.links.demo && (
                  <MagneticWrap>
                    <a href={proj.links.demo} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-foreground hover:text-accent-secondary transition-colors">
                      <FiYoutube size={14} /> Demo
                    </a>
                  </MagneticWrap>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
