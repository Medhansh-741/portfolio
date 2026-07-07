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
    <main className="min-h-screen bg-grid-paper">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center space-y-2 mb-12">
          <span className="font-hand text-lg text-[#C4866D] tracking-wider font-semibold">What I&apos;ve Built</span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-[#20280B]">Projects</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {profile.projects.map((proj, i) => (
            <motion.div
              key={proj.title}
              variants={stagger}
              initial="hidden"
              animate="show"
              custom={i}
              whileHover={{ y: -6, boxShadow: "0 12px 40px rgba(0,0,0,0.08)" }}
              className="bg-[#FCF9F2] border border-[#6A784D]/20 rounded-lg p-6 md:p-8 shadow-sm flex flex-col cursor-default"
            >
              <div className="mb-3">
                <h2 className="font-serif text-xl font-bold text-[#20280B]">{proj.title}</h2>
                <p className="text-sm font-semibold text-[#C4866D]">{proj.subtitle}</p>
                <span className="text-xs text-[#6A784D]">{proj.period}</span>
              </div>

              <p className="text-sm text-[#33432B]/80 mb-3 leading-relaxed">{proj.description}</p>

              {proj.metrics && (
                <div className="mb-3">
                  <span className="text-xs font-bold text-[#C4866D] bg-[#C4866D]/10 px-2 py-1 rounded">
                    {proj.metrics}
                  </span>
                </div>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                {proj.tech.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#6A784D]/10 text-[#6A784D] border border-[#6A784D]/20">
                    {t}
                  </span>
                ))}
              </div>

              <ul className="space-y-2 mb-6 flex-1">
                {proj.highlights.map((h, j) => (
                  <li key={j} className="text-sm text-[#33432B]/90 leading-relaxed pl-4 border-l-2 border-[#C4866D]/40">
                    {h}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3 pt-4 border-t border-[#6A784D]/10">
                {proj.links.live && (
                  <MagneticWrap>
                    <a href={proj.links.live} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C4866D] hover:underline">
                      <FiExternalLink size={14} /> Live
                    </a>
                  </MagneticWrap>
                )}
                {proj.links.github && (
                  <MagneticWrap>
                    <a href={proj.links.github} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#33432B] hover:underline">
                      <FiGithub size={14} /> GitHub
                    </a>
                  </MagneticWrap>
                )}
                {proj.links.demo && (
                  <MagneticWrap>
                    <a href={proj.links.demo} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6A784D] hover:underline">
                      <FiYoutube size={14} /> Demo Video
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
