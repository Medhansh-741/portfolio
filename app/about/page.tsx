"use client";

import { motion } from "framer-motion";
import { FiExternalLink, FiAward, FiBookOpen } from "react-icons/fi";
import { profile } from "@/app/data/profile";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-grid-paper">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* About */}
        <section className="mb-16">
          <div className="text-center space-y-2 mb-8">
            <span className="font-hand text-lg text-[#C4866D] tracking-wider font-semibold">About Me</span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-[#20280B]">
              Driven by code, obsessed with craft.
            </h1>
          </div>
          <div className="space-y-4 max-w-3xl mx-auto">
            {profile.about.map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="text-base text-[#33432B]/90 leading-relaxed text-center"
              >
                {para}
              </motion.p>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section className="mb-16">
          <div className="text-center space-y-2 mb-8">
            <span className="font-hand text-lg text-[#C4866D] tracking-wider font-semibold">Recognition</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-[#20280B]">
              Achievements
            </h2>
          </div>
          <div className="space-y-6">
            {profile.achievements.map((ach, i) => (
              <motion.div
                key={ach.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                className="flex items-start gap-4 bg-[#FCF9F2] border border-[#6A784D]/20 rounded-lg p-6 shadow-sm"
              >
                <div className="w-10 h-10 rounded-lg bg-[#C4866D]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiAward className="text-[#C4866D]" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg font-bold text-[#20280B]">{ach.title}</h3>
                  <p className="text-sm text-[#33432B]/80 mt-1 leading-relaxed">{ach.detail}</p>
                  <a href={ach.certificate} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#C4866D] hover:underline mt-2">
                    View Certificate <FiExternalLink size={12} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section>
          <div className="text-center space-y-2 mb-8">
            <span className="font-hand text-lg text-[#C4866D] tracking-wider font-semibold">Academic Background</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-[#20280B]">
              Education
            </h2>
          </div>
          <div className="space-y-6">
            {profile.education.map((edu, i) => (
              <motion.div
                key={edu.institution}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="flex items-start gap-4 bg-[#FCF9F2] border border-[#6A784D]/20 rounded-lg p-6 shadow-sm"
              >
                <div className="w-10 h-10 rounded-lg bg-[#6A784D]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiBookOpen className="text-[#6A784D]" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg font-bold text-[#20280B]">{edu.institution}</h3>
                  <p className="text-sm font-semibold text-[#C4866D] mt-1">{edu.degree}</p>
                  <span className="text-xs text-[#6A784D]">{edu.period}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
