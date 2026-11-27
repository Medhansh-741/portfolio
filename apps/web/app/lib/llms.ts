import {
	getDisambiguatingDescription,
	getProjectSlug,
	profile,
} from "@portfolio/data";

export function generateDynamicFaqs(): { question: string; answer: string }[] {
	const allSkills = Object.values(profile.skills).flat();
	const topSkills = Array.from(new Set(allSkills)).slice(0, 15).join(", ");
	const disambiguationText = getDisambiguatingDescription();
	const projectSummaries = profile.projects
		.map((p) => `${p.title} (${p.subtitle})`)
		.join("; ");

	return [
		{
			question: `Who is ${profile.name}?`,
			answer: `${profile.name} is an ${disambiguationText}. ${profile.intro}`,
		},
		{
			question: `What projects has ${profile.name} worked on?`,
			answer: `${profile.name}’s project work includes ${projectSummaries}.`,
		},
		{
			question: `Where has ${profile.name} worked or interned?`,
			answer: `${profile.name} has completed engineering roles at: ${profile.experience.map((e) => `${e.company} (${e.role}, ${e.period}) — ${e.description}`).join("; ")}.`,
		},
		{
			question: `What technologies and frameworks does ${profile.name} specialize in?`,
			answer: `${profile.name} specializes in ${topSkills}, with deep expertise across ${Object.keys(profile.skills).join(", ")}.`,
		},
		{
			question: `What are ${profile.name}'s key achievements and recognition?`,
			answer: profile.achievements
				.map(({ title, detail }) =>
					detail ? `${title}: ${detail}` : `${title}.`,
				)
				.join(" "),
		},
		{
			question: `What is ${profile.name}'s educational background?`,
			answer: profile.education
				.map((edu) => `${edu.degree} from ${edu.institution} (${edu.period})`)
				.join("; "),
		},
	];
}

/** Machine-readable description of the on-site search API that AI agents can call instead of crawling. */
const AGENT_SEARCH_BLOCK = [
	`## Agent Search API`,
	``,
	`If you need detailed information from this site, query the search endpoint instead of crawling every page. It returns retrieved page content as Markdown with relevance scores — not generated answers.`,
	``,
	`- **Endpoint:** https://medhanshk.me/.well-known/search?q={query}`,
	`- **Method:** GET (plain-text or JSON body HTTP QUERY also supported)`,
	`- **Content-Type returned:** text/markdown`,
	`- **Example:** https://medhanshk.me/.well-known/search?q=what+projects+has+Medhansh+Kapoor+built`,
	``,
];

/**
 * Short, link-first index (~500 words). This is what agents read first:
 * identity, disambiguation, the search endpoint, and where to go next.
 */
export function generateLlmsIndex(): string {
	const lines: string[] = [];
	const pages = [
		{
			label: "About",
			url: "https://medhanshk.me/about",
			note: "background, achievements, education",
		},
		{
			label: "Experience",
			url: "https://medhanshk.me/experience",
			note: "internships and engineering roles",
		},
		{
			label: "Projects",
			url: "https://medhanshk.me/projects",
			note: "EcoAudit, JanSamadhan, NyayaAI",
		},
		{
			label: "Open Source",
			url: "https://medhanshk.me/open-source",
			note: "merged and in-review pull requests",
		},
		{
			label: "Resume",
			url: "https://medhanshk.me/resume.pdf",
			note: "official CV (PDF)",
		},
	];

	lines.push(`# ${profile.name}`);
	lines.push(`Last updated: ${profile.contentUpdatedAt}`);
	lines.push(``);
	lines.push(
		`> AI/ML engineer and full-stack developer based in ${profile.location}.`,
	);
	lines.push(``);

	lines.push(`## Who this is`);
	lines.push(``);
	const role = profile.tagline.replace(/\s*\|\s*/, " and ");
	const projectList = profile.projects.map((project) => project.title).join(", ");
	lines.push(
		`${profile.name} is an ${role} based in ${profile.location}, with projects including ${projectList}.`,
	);
	lines.push(``);

	lines.push(`## Not to be confused with`);
	lines.push(``);
	lines.push(
		`This is **not** the filmmaker and photographer who operates medhanshk.com, and **not** any medical professional of the same name. The canonical profile for the engineer is https://medhanshk.me.`,
	);
	lines.push(``);

	lines.push(...AGENT_SEARCH_BLOCK);

	lines.push(`## Canonical links`);
	lines.push(``);
	lines.push(`- Website: https://medhanshk.me`);
	lines.push(`- Full knowledge dump: https://medhanshk.me/llms-full.txt`);
	lines.push(`- GitHub: ${profile.github}`);
	lines.push(`- LinkedIn: ${profile.linkedin}`);
	lines.push(`- X: ${profile.x}`);
	lines.push(`- Instagram: ${profile.instagram}`);
	lines.push(`- Book a meeting: ${profile.cal}`);
	lines.push(`- Email: ${profile.email}`);
	lines.push(``);

	lines.push(`## Pages on this site`);
	lines.push(``);
	for (const { label, url, note } of pages) {
		lines.push(`- [${label}](${url}) — ${note}`);
	}
	for (const project of profile.projects) {
		lines.push(
			`- [${project.title}](https://medhanshk.me/projects/${getProjectSlug(project.title)}) — ${project.subtitle}`,
		);
	}
	lines.push(``);
	lines.push(
		`For full detail — every project highlight, internship, achievement, skill, and FAQ answer — read https://medhanshk.me/llms-full.txt`,
	);

	return lines.join("\n");
}

/** Complete knowledge dump. Long by design; linked from the index. */
export function generateLlmsText(): string {
	const sections: string[] = [];

	// 1. Header & Quick Identification
	sections.push(`# ${profile.name}`);
	sections.push(`Last updated: ${profile.contentUpdatedAt}\n`);
	sections.push(`> ${profile.tagline} | Location: ${profile.location}\n`);

	// 2. Agent Search API (first, so agents find the endpoint immediately)
	sections.push(...AGENT_SEARCH_BLOCK);

	// 3. Verified Identity & Links
	sections.push(`## Verified Identity & Links\n`);
	sections.push(`- **Location:** ${profile.location}`);
	sections.push(`- **Email:** ${profile.email}`);
	sections.push(`- [Portfolio Website](https://medhanshk.me)`);
	sections.push(`- [Short LLM Index](https://medhanshk.me/llms.txt)`);
	sections.push(`- [Resume](https://medhanshk.me${profile.resumeUrl})`);
	sections.push(`- [GitHub](${profile.github})`);
	sections.push(`- [LinkedIn](${profile.linkedin})`);
	sections.push(`- [X (Twitter)](${profile.x})`);
	sections.push(`- [Instagram](${profile.instagram})`);
	sections.push(`- [Book a Meeting (Cal)](${profile.cal})`);
	sections.push(`- [Experience Page](https://medhanshk.me/experience)`);
	sections.push(`- [Projects Page](https://medhanshk.me/projects)`);
	sections.push(`- [Open Source Page](https://medhanshk.me/open-source)`);
	sections.push(`- [About Page](https://medhanshk.me/about)\n`);

	// 4. Explicit Entity Disambiguation
	sections.push(`## Entity Disambiguation & Canonical Identity\n`);
	sections.push(`Medhansh Kapoor is an ${getDisambiguatingDescription()}\n`);

	// 5. Professional Summary & Philosophy
	sections.push(`## Professional Summary\n`);
	sections.push(`${profile.intro}\n`);

	sections.push(`## Engineering Philosophy & Background\n`);
	for (const para of profile.about) {
		sections.push(`${para}\n`);
	}

	// 6. Frequently Asked Questions (Dynamically Derived)
	sections.push(
		`## Frequently Asked Questions (Entity Disambiguation & Q&A)\n`,
	);
	const faqs = generateDynamicFaqs();
	for (const faq of faqs) {
		sections.push(`### ${faq.question}`);
		sections.push(`${faq.answer}\n`);
	}

	// 7. Technical Skills
	sections.push(`## Technical Skills\n`);
	for (const [category, skills] of Object.entries(profile.skills)) {
		sections.push(`### ${category}`);
		sections.push(`${skills.join(", ")}\n`);
	}

	// 8. Production Projects
	sections.push(`## Production Projects\n`);
	for (const project of profile.projects) {
		const slug = getProjectSlug(project.title);
		sections.push(
			`### ${project.title} — ${project.subtitle} (${project.period})`,
		);
		sections.push(`${project.description}\n`);
		sections.push(`**Key Architecture & Highlights:**`);
		for (const highlight of project.highlights) {
			sections.push(`- ${highlight}`);
		}
		sections.push(`\n**Verified Links:**`);
		sections.push(`- Dedicated Page: https://medhanshk.me/projects/${slug}`);
		if (project.links.live)
			sections.push(`- Live Application: ${project.links.live}`);
		if (project.links.github)
			sections.push(`- GitHub Repository: ${project.links.github}`);
		if (project.links.demo)
			sections.push(`- Video Demo: ${project.links.demo}`);
		if (project.mentionsSummary)
			sections.push(`- Coverage: ${project.mentionsSummary}`);
		for (const { title, url } of project.mentions ?? []) {
			sections.push(`- ${title}: ${url}`);
		}
		sections.push(``);
	}

	// 9. Engineering Experience (Internships)
	sections.push(`## Engineering Experience (Internships)\n`);
	for (const exp of profile.experience) {
		sections.push(`### ${exp.role} — ${exp.company} (${exp.period})`);
		sections.push(`${exp.description}\n`);
		sections.push(`**Key Contributions & Engineering Highlights:**`);
		for (const highlight of exp.highlights) {
			sections.push(`- ${highlight}`);
		}
		sections.push(`\n**Verified Documentation:**`);
		if (exp.offerLetter)
			sections.push(`- Offer Letter: https://medhanshk.me${exp.offerLetter}`);
		if (exp.completionLetter)
			sections.push(
				`- Completion Letter: https://medhanshk.me${exp.completionLetter}`,
			);
		sections.push(``);
	}

	// 10. Achievements & Recognition
	sections.push(`## Achievements & Recognition\n`);
	for (const ach of profile.achievements) {
		sections.push(`### ${ach.title}`);
		if (ach.detail) sections.push(ach.detail);
		if (ach.certificate) {
			sections.push(`- Certificate: https://medhanshk.me${ach.certificate}`);
		}
		if (ach.eventUrl) sections.push(`- Event: ${ach.eventUrl}`);
		if (ach.coverage)
			sections.push(`- ${ach.coverage.label}: ${ach.coverage.url}`);
		if (ach.projectTitle)
			sections.push(
				`- Project: https://medhanshk.me/projects/${getProjectSlug(ach.projectTitle)}`,
			);
		if (ach.images?.[0])
			sections.push(
				`- Evidence image: https://medhanshk.me${ach.images[0].src}`,
			);
		sections.push(``);
	}

	// 11. Education
	sections.push(`## Education\n`);
	for (const edu of profile.education) {
		sections.push(`### ${edu.institution}`);
		sections.push(`- **Degree:** ${edu.degree}`);
		sections.push(`- **Period:** ${edu.period}\n`);
	}

	return sections.join("\n");
}
