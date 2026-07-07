import Link from "next/link";
import { FiDownload, FiArrowLeft } from "react-icons/fi";
import { profile } from "@/app/data/profile";

export const revalidate = 3600;

export default function ResumePage() {
  return (
    <main className="min-h-screen bg-muted">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground hover:text-muted-foreground transition-colors"
          >
            <FiArrowLeft size={16} />
            Back
          </Link>
          <a
            href={profile.resumeUrl}
            download
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-widest bg-background text-foreground border-[3px] border-border shadow-sm hover:shadow-[3px_3px_0_0_var(--accent)] hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-200 select-none cursor-pointer"
          >
            <FiDownload size={16} />
            Download PDF
          </a>
        </div>

        <div className="bg-card text-card-foreground border-[3px] border-border shadow-lg p-8 md:p-12 print:p-6 print:shadow-none print:border-none">
          <div className="text-center border-b-[3px] border-border pb-6 mb-6">
            <h1 className="text-3xl font-black text-foreground uppercase">{profile.name}</h1>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">{profile.tagline}</p>
            <p className="text-[11px] text-muted-foreground mt-2">
              {profile.email} | {profile.phone} | {profile.github.replace("https://", "")} | {profile.linkedin.replace("https://", "")}
            </p>
          </div>

          <Section title="Skills">
            {Object.entries(profile.skills).map(([cat, items]) => (
              <p key={cat} className="text-xs mb-1">
                <span className="font-bold text-foreground uppercase">{cat}:</span>{" "}
                <span className="text-muted-foreground">{items.join(", ")}</span>
              </p>
            ))}
          </Section>

          <Section title="Experience">
            {profile.experience.map((exp) => (
              <div key={exp.company} className="mb-6 last:mb-0">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-foreground text-xs uppercase">{exp.company}</h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{exp.role}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-semibold whitespace-nowrap ml-4">{exp.period}</span>
                </div>
                <p className="text-[11px] text-muted-foreground italic mb-2 leading-relaxed">{exp.description}</p>
                <p className="text-[10px] text-muted-foreground mb-2">{exp.tech.join(", ")}</p>
                <ul className="list-disc list-inside space-y-1">
                  {exp.highlights.map((h, i) => (
                    <li key={i} className="text-[11px] text-muted-foreground leading-relaxed">{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Section>

          <Section title="Projects">
            {profile.projects.map((proj) => (
              <div key={proj.title} className="mb-5 last:mb-0">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-foreground text-xs uppercase">{proj.title}</h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{proj.subtitle}</p>
                  </div>
                  <div className="text-right ml-4">
                    <span className="text-[10px] text-muted-foreground block">{proj.period}</span>
                    {proj.metrics && (
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">{proj.metrics}</span>
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground italic mb-1">{proj.description}</p>
                <p className="text-[10px] text-muted-foreground mb-1">{proj.tech.join(", ")}</p>
                <ul className="list-disc list-inside space-y-0.5">
                  {proj.highlights.map((h, i) => (
                    <li key={i} className="text-[11px] text-muted-foreground leading-relaxed">{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Section>

          <Section title="Achievements">
            {profile.achievements.map((ach) => (
              <div key={ach.title} className="mb-3 last:mb-0">
                <h3 className="font-bold text-foreground text-xs uppercase">{ach.title}</h3>
                <p className="text-[11px] text-muted-foreground">{ach.detail}</p>
              </div>
            ))}
          </Section>

          <Section title="Education">
            {profile.education.map((edu) => (
              <div key={edu.institution} className="mb-2 last:mb-0">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-bold text-foreground text-xs uppercase">{edu.institution}</h3>
                    <p className="text-[11px] text-muted-foreground">{edu.degree}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-semibold whitespace-nowrap ml-4">{edu.period}</span>
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
      <h2 className="text-xs font-bold uppercase tracking-widest text-accent border-b-[3px] border-border pb-1 mb-3">
        {title}
      </h2>
      {children}
    </div>
  );
}
