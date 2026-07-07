"use client";

import { motion } from "framer-motion";
import { FiExternalLink } from "react-icons/fi";
import { profile } from "@/app/data/profile";
import MagneticWrap from "@/app/components/MagneticWrap";

const stagger = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 120, damping: 14, delay: i * 0.18 },
  }),
};

export default function ExperiencePage() {
  return (
    <main className="min-h-screen bg-grid-paper">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center space-y-2 mb-12">
          <span className="font-hand text-lg text-[#C4866D] tracking-wider font-semibold">Where I&apos;ve Worked</span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-[#20280B]">Experience</h1>
        </div>

        <div className="space-y-10">
          {profile.experience.map((exp, i) => (
            <motion.div
              key={exp.company}
              variants={stagger}
              initial="hidden"
              animate="show"
              custom={i}
              whileHover={{ y: -4, boxShadow: "0 10px 35px rgba(0,0,0,0.06)" }}
              className="bg-[#FCF9F2] border border-[#6A784D]/20 rounded-lg p-6 md:p-8 shadow-sm cursor-default"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                <div>
                  <h2 className="font-serif text-xl font-bold text-[#20280B]">{exp.company}</h2>
                  <p className="text-sm font-semibold text-[#C4866D]">{exp.role}</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold text-[#6A784D] whitespace-nowrap">
                  <span>{exp.period}</span>
                  <MagneticWrap>
                    <a href={exp.offerLetter} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#C4866D] hover:underline">
                      Offer Letter <FiExternalLink size={12} />
                    </a>
                  </MagneticWrap>
                </div>
              </div>

              <p className="text-sm text-[#33432B]/80 mb-4 leading-relaxed italic">{exp.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {exp.tech.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#6A784D]/10 text-[#6A784D] border border-[#6A784D]/20">
                    {t}
                  </span>
                ))}
              </div>

              <ul className="space-y-2">
                {exp.highlights.map((h, j) => (
                  <li key={j} className="text-sm text-[#33432B]/90 leading-relaxed pl-4 border-l-2 border-[#C4866D]/40">
                    {h}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
