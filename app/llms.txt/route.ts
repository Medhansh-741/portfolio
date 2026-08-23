import { NextResponse } from "next/server";
import { profile } from "@/app/data/profile";

export function generateLlmsText(): string {
	const sections: string[] = [];

	// Header
	sections.push(`# ${profile.name}`);
	sections.push(`> ${profile.tagline}\n`);
	sections.push(`- **Location:** ${profile.location}`);
	sections.push(`- **Email:** ${profile.email}`);
	sections.push(`- **GitHub:** ${profile.github}`);
	sections.push(`- **LinkedIn:** ${profile.linkedin}`);
	sections.push(`- **X (Twitter):** ${profile.x}`);
	sections.push(`- **Portfolio:** https://medhanshk.me\n`);

	// Summary & Philosophy
	sections.push(`## Professional Summary\n`);
	sections.push(`${profile.intro}\n`);
	sections.push(`## Philosophy & Approach\n`);
	sections.push(`${profile.about[0]}\n`);

	// Skills
	sections.push(`## Technical Skills\n`);
	for (const [category, skills] of Object.entries(profile.skills)) {
		sections.push(`### ${category}`);
		sections.push(`${skills.join(", ")}\n`);
	}

	// Projects
	sections.push(`## Production Projects\n`);
	for (const project of profile.projects) {
		sections.push(`### ${project.title} — ${project.subtitle} (${project.period})`);
		sections.push(`${project.description}\n`);
		sections.push(`**Technologies:** ${project.tech.join(", ")}\n`);
		sections.push(`**Key Architecture & Highlights:**`);
		for (const highlight of project.highlights) {
			sections.push(`- ${highlight}`);
		}
		sections.push(`\n**Links:**`);
		if (project.links.live) sections.push(`- Live: ${project.links.live}`);
		if (project.links.github) sections.push(`- GitHub: ${project.links.github}`);
		if (project.links.demo) sections.push(`- Video Demo: ${project.links.demo}`);
		sections.push(``);
	}

	// Experience (Internships)
	sections.push(`## Engineering Experience (Internships)\n`);
	for (const exp of profile.experience) {
		sections.push(`### ${exp.role} — ${exp.company} (${exp.period})`);
		sections.push(`${exp.description}\n`);
		sections.push(`**Technologies:** ${exp.tech.join(", ")}\n`);
		sections.push(`**Key Contributions & Engineering Highlights:**`);
		for (const highlight of exp.highlights) {
			sections.push(`- ${highlight}`);
		}
		sections.push(``);
	}

	// Achievements
	sections.push(`## Achievements & Recognition\n`);
	for (const ach of profile.achievements) {
		sections.push(`### ${ach.title}`);
		sections.push(`${ach.detail}\n`);
	}

	// Education
	sections.push(`## Education\n`);
	for (const edu of profile.education) {
		sections.push(`### ${edu.institution}`);
		sections.push(`- **Degree:** ${edu.degree}`);
		sections.push(`- **Period:** ${edu.period}\n`);
	}

	return sections.join("\n");
}

export async function GET() {
	const content = generateLlmsText();
	return new NextResponse(content, {
		status: 200,
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "public, max-age=3600, s-maxage=86400",
		},
	});
}
