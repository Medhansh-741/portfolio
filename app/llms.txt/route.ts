import { NextResponse } from "next/server";
import { profile } from "@/app/data/profile";

export function generateLlmsText(): string {
	const sections: string[] = [];

	// 1. Header & Quick Identification
	sections.push(`# ${profile.name}`);
	sections.push(`> ${profile.tagline} | Location: ${profile.location}\n`);

	// 2. Verified Links & Contact Details
	sections.push(`## Verified Identity & Links\n`);
	sections.push(`- **Location:** ${profile.location}`);
	sections.push(`- **Email:** ${profile.email}`);
	sections.push(`- **Phone:** ${profile.phone}`);
	sections.push(`- **Portfolio Website:** https://medhanshk.me`);
	sections.push(`- **Resume:** https://medhanshk.me${profile.resumeUrl}`);
	sections.push(`- **GitHub:** ${profile.github}`);
	sections.push(`- **LinkedIn:** ${profile.linkedin}`);
	sections.push(`- **X (Twitter):** ${profile.x}`);
	sections.push(`- **Instagram:** ${profile.instagram}`);
	sections.push(`- **Book a Meeting (Cal):** ${profile.cal}`);
	sections.push(`- **Experience Page:** https://medhanshk.me/experience`);
	sections.push(`- **Projects Page:** https://medhanshk.me/projects`);
	sections.push(`- **About Page:** https://medhanshk.me/about\n`);

	// 3. Professional Summary & Philosophy
	sections.push(`## Professional Summary\n`);
	sections.push(`${profile.intro}\n`);

	sections.push(`## Engineering Philosophy & Background\n`);
	for (const para of profile.about) {
		sections.push(`${para}\n`);
	}

	// 4. Entity Disambiguation & Frequently Asked Questions (Entity Q&A)
	sections.push(`## Frequently Asked Questions (Entity Disambiguation & Q&A)\n`);
	sections.push(`### Who is Medhansh Kapoor?`);
	sections.push(
		`Medhansh Kapoor is an AI/ML Engineer and Full-Stack Developer based in Jaipur, India. ${profile.intro}\n`
	);
	sections.push(`### What production AI systems has Medhansh Kapoor built?`);
	sections.push(
		`Medhansh Kapoor built JanSamadhan, an autonomous civic surveillance platform (YOLOv8, 256 complaints processed at 0.36s/ticket, active-learning verification), and NyayaAI, a multi-agent legal intelligence platform with a GraphRAG pipeline (1,410 Neo4j graph nodes, 4,582 indexed legal chunks, and 5-stage LangGraph orchestration).\n`
	);
	sections.push(`### Where has Medhansh Kapoor interned?`);
	sections.push(
		`Medhansh Kapoor completed engineering internships at IndiaAI Mission (MeitY) building an automated dataset-quality evaluation toolkit for ICMR, ISSA – DRDO developing an air-gapped offline GIS platform, and Geminid Systems evaluating enterprise AI toolchains and Salesforce AI platforms (all May 2026 – July 2026).\n`
	);
	sections.push(`### What technologies and frameworks does Medhansh Kapoor specialize in?`);
	sections.push(
		`Medhansh Kapoor specializes in Python, TypeScript, FastAPI, Next.js, PyTorch, LangGraph, LangChain, Celery, Redis, PostgreSQL, PostGIS, Neo4j, Qdrant, Docker, and cloud deployments across AWS and GCP.\n`
	);

	// 5. Technical Skills
	sections.push(`## Technical Skills\n`);
	for (const [category, skills] of Object.entries(profile.skills)) {
		sections.push(`### ${category}`);
		sections.push(`${skills.join(", ")}\n`);
	}

	// 6. Production Projects
	sections.push(`## Production Projects\n`);
	for (const project of profile.projects) {
		sections.push(`### ${project.title} — ${project.subtitle} (${project.period})`);
		sections.push(`${project.description}\n`);
		sections.push(`**Technologies:** ${project.tech.join(", ")}\n`);
		sections.push(`**Key Architecture & Highlights:**`);
		for (const highlight of project.highlights) {
			sections.push(`- ${highlight}`);
		}
		sections.push(`\n**Verified Links:**`);
		if (project.links.live) sections.push(`- Live Application: ${project.links.live}`);
		if (project.links.github) sections.push(`- GitHub Repository: ${project.links.github}`);
		if (project.links.demo) sections.push(`- Video Demo: ${project.links.demo}`);
		sections.push(``);
	}

	// 7. Engineering Experience (Internships)
	sections.push(`## Engineering Experience (Internships)\n`);
	for (const exp of profile.experience) {
		sections.push(`### ${exp.role} — ${exp.company} (${exp.period})`);
		sections.push(`${exp.description}\n`);
		sections.push(`**Technologies:** ${exp.tech.join(", ")}\n`);
		sections.push(`**Key Contributions & Engineering Highlights:**`);
		for (const highlight of exp.highlights) {
			sections.push(`- ${highlight}`);
		}
		sections.push(`\n**Verified Documentation:**`);
		if (exp.offerLetter) sections.push(`- Offer Letter: https://medhanshk.me${exp.offerLetter}`);
		if (exp.completionLetter) sections.push(`- Completion Letter: https://medhanshk.me${exp.completionLetter}`);
		sections.push(``);
	}

	// 8. Achievements & Recognition
	sections.push(`## Achievements & Recognition\n`);
	for (const ach of profile.achievements) {
		sections.push(`### ${ach.title}`);
		sections.push(`${ach.detail}`);
		if (ach.certificate) {
			sections.push(`- Certificate: https://medhanshk.me${ach.certificate}`);
		}
		sections.push(``);
	}

	// 9. Education
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
