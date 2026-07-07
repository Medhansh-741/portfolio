import Link from "next/link";
import { FiDownload, FiArrowLeft } from "react-icons/fi";
import { profile } from "@/app/data/profile";

export default function ResumePage() {
  return (
    <main className="min-h-screen bg-[#F4EFE6]">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#33432B] hover:text-[#C4866D] transition-colors"
          >
            <FiArrowLeft size={16} />
            Back to Portfolio
          </Link>
          <a
            href={profile.resumeUrl}
            download
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C4866D] text-[#FCF9F2] font-semibold text-sm hover:bg-[#b0745b] shadow-md hover:shadow-lg transition-all"
          >
            <FiDownload size={16} />
            Download PDF
          </a>
        </div>

        <div className="bg-[#FCF9F2] border border-[#6A784D]/20 rounded-lg shadow-lg p-8 md:p-12 print:p-6 print:shadow-none print:border-none">
          {/* Header */}
          <div className="text-center border-b border-[#6A784D]/20 pb-6 mb-6">
            <h1 className="text-3xl font-bold text-[#20280B]">{profile.name}</h1>
            <p className="text-[#6A784D] font-semibold mt-1">{profile.tagline}</p>
            <p className="text-sm text-[#33432B]/70 mt-2">
              {profile.email} | {profile.phone} | {profile.github.replace("https://", "")} | {profile.linkedin.replace("https://", "")}
            </p>
          </div>

          {/* Skills */}
          <Section title="Skills">
            {Object.entries(profile.skills).map(([cat, items]) => (
              <p key={cat} className="text-sm mb-1">
                <span className="font-bold text-[#20280B]">{cat}:</span>{" "}
                <span className="text-[#33432B]/80">{items.join(", ")}</span>
              </p>
            ))}
          </Section>

          {/* Experience */}
          <Section title="Experience">
            {profile.experience.map((exp) => (
              <div key={exp.company} className="mb-6 last:mb-0">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-[#20280B] text-sm">{exp.company}</h3>
                    <p className="text-xs font-semibold text-[#C4866D]">{exp.role}</p>
                  </div>
                  <span className="text-xs text-[#6A784D] whitespace-nowrap ml-4">{exp.period}</span>
                </div>
                <p className="text-xs text-[#33432B]/80 italic mb-2 leading-relaxed">{exp.description}</p>
                <p className="text-xs text-[#6A784D] mb-2">{exp.tech.join(", ")}</p>
                <ul className="list-disc list-inside space-y-1">
                  {exp.highlights.map((h, i) => (
                    <li key={i} className="text-xs text-[#33432B]/90 leading-relaxed">{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Section>

          {/* Projects */}
          <Section title="Projects">
            {profile.projects.map((proj) => (
              <div key={proj.title} className="mb-5 last:mb-0">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-[#20280B] text-sm">{proj.title}</h3>
                    <p className="text-xs font-semibold text-[#C4866D]">{proj.subtitle}</p>
                  </div>
                  <div className="text-right ml-4">
                    <span className="text-xs text-[#6A784D] block">{proj.period}</span>
                    {proj.metrics && (
                      <span className="text-[10px] font-bold text-[#C4866D]">{proj.metrics}</span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-[#33432B]/80 italic mb-1">{proj.description}</p>
                <p className="text-xs text-[#6A784D] mb-1">{proj.tech.join(", ")}</p>
                <ul className="list-disc list-inside space-y-0.5">
                  {proj.highlights.map((h, i) => (
                    <li key={i} className="text-xs text-[#33432B]/90 leading-relaxed">{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Section>

          {/* Achievements */}
          <Section title="Achievements">
            {profile.achievements.map((ach) => (
              <div key={ach.title} className="mb-3 last:mb-0">
                <h3 className="font-bold text-[#20280B] text-sm">{ach.title}</h3>
                <p className="text-xs text-[#33432B]/80">{ach.detail}</p>
              </div>
            ))}
          </Section>

          {/* Education */}
          <Section title="Education">
            {profile.education.map((edu) => (
              <div key={edu.institution} className="mb-2 last:mb-0">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-bold text-[#20280B] text-sm">{edu.institution}</h3>
                    <p className="text-xs text-[#33432B]/80">{edu.degree}</p>
                  </div>
                  <span className="text-xs text-[#6A784D] whitespace-nowrap ml-4">{edu.period}</span>
                </div>
              </div>
            ))}
          </Section>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-sm font-bold uppercase tracking-wider text-[#6A784D] border-b border-[#6A784D]/20 pb-1 mb-3">
        {title}
      </h2>
      {children}
    </div>
  );
}
