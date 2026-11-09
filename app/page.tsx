import Script from "next/script";
import { JsonLd, getProfilePageSchema } from "./lib/jsonld";
import { profile } from "@/app/data/profile";
import { escapeHtml, icon, PortfolioPage, renderDemo, repositoryLink } from "./portfolio-page";

const skillGroups = [
	["Languages", ["Python", "TypeScript", "JavaScript", "SQL", "C/C++"]],
	["Applied AI", ["Multi-agent workflows (LangGraph, tool calling)", "RAG (LangChain, LlamaIndex)", "Hybrid search, reranking & retrieval evaluation"]],
	["Machine Learning", ["PyTorch", "Computer vision (YOLOv8, OpenCV)", "ONNX inference", "Sentence Transformers"]],
	["Frontend", ["React", "Next.js", "HTML/CSS", "Tailwind CSS"]],
	["Backend", ["FastAPI", "Node.js", "REST APIs", "WebSockets", "Celery", "Pydantic"]],
	["Databases", ["PostgreSQL", "Supabase", "Redis", "SQLite", "Qdrant (vector search)", "Neo4j (graph)"]],
	["Deployment", ["Docker / Podman", "Linux (RHEL, Ubuntu)", "Git", "GitHub Actions (CI/CD)"]],
	["Cloud", ["Google Cloud (Cloud Run)", "AWS (S3, Lambda)", "Vercel"]],
	["Data & Geospatial", ["ETL pipelines", "PostGIS", "GDAL", "GeoServer", "Martin Tile Server", "OpenLayers"]],
	["Testing & Performance", ["Playwright", "Lighthouse", "Python CPU and memory profiling", "SQL query-plan analysis"]],
] as const;

function renderSkillRows(groups: ReadonlyArray<readonly [string, readonly string[]]>) {
	return groups.map(([label, skills]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(skills.join(" · "))}</dd></div>`).join("");
}

const contacts = [
	["GitHub", profile.github, "github"],
	["LinkedIn", profile.linkedin, "linkedin"],
	["X", profile.x, "x"],
	["Email", `mailto:${profile.email}`, "email"],
	["Résumé", profile.resumeUrl, "resume"],
	["Book a call", profile.cal, "calendar"],
] as const;

const projects = profile.projects.map((project, index) => {
	const title = escapeHtml(project.title);
	return `<div class="deck-item" data-project${index ? " inert" : ""}>
		<div class="deck-heading">
			<h2>${title}</h2>
			${repositoryLink(project)}
		</div>
		<p class="deck-caption">${escapeHtml(project.subtitle)}</p>
		${renderDemo(project, index ? ' fetchpriority="low"' : "")}
	</div>`;
}).join("");

const experience = profile.experience.map((item) => `
	<div class="deck-item" data-experience inert>
		<div class="deck-heading"><h2>${escapeHtml(item.company)}</h2></div>
		<div class="experience-proof" role="group" aria-label="Experience documents">
			<a href="${escapeHtml(item.offerLetter)}">Offer letter</a>
			<a href="${escapeHtml(item.completionLetter)}">Completion letter</a>
		</div>
		<div class="experience-item">
			<p class="experience-role">${escapeHtml(item.role)}</p>
			<p class="experience-period">${escapeHtml(item.period)}</p>
			<p>${escapeHtml(item.description)}</p>
		</div>
	</div>`).join("");

const achievements = profile.achievements.map(({ title, homeImage, images }) => {
	const photo = homeImage ?? images?.[0];
	if (!photo) return "";
	return `<div class="deck-item" data-achievement inert>
		<div class="deck-heading"><h2>${escapeHtml(title)}</h2></div>
		<img class="achievement-photo deck-achievement-photo" src="${escapeHtml(photo.src)}" alt="${escapeHtml(photo.alt)}" width="${photo.width}" height="${photo.height}" loading="lazy">
	</div>`;
}).join("");

const content = `
			<section class="intro" aria-label="Profile">
				<p class="role">${escapeHtml(profile.tagline)}</p>
				<ul class="contact-links" aria-label="Contact and profiles">
					${contacts.map(([label, href, symbol]) => `<li><a href="${escapeHtml(href)}" aria-label="${label}"><span>${label}</span>${icon(symbol)}</a></li>`).join("")}
				</ul>
			</section>
			<section class="skills" aria-label="Technical skills">
				<dl class="skill-list">${renderSkillRows(skillGroups.slice(0, 2))}</dl>
				<details class="more-skills">
					<summary><span class="skills-expand">Show all skills</span><span class="skills-collapse">Show fewer skills</span>${icon("chevron")}</summary>
					<dl class="skill-list">${renderSkillRows(skillGroups.slice(2))}</dl>
				</details>
			</section>
			<section class="deck" aria-label="Selected work" data-deck>
				<div class="deck-track" id="deck-content">
					${projects}
					${experience}
					${achievements}
				</div>
				<p class="sr-only" data-deck-status role="status"></p>
				<div class="deck-footer">
					<div class="deck-categories" role="group" aria-label="Work category" data-categories hidden>
						<button type="button" data-category="projects" aria-pressed="true" aria-controls="deck-content">Projects</button>
						<button type="button" data-category="experience" aria-pressed="false" aria-controls="deck-content">Experience</button>
						<button type="button" data-category="achievements" aria-pressed="false" aria-controls="deck-content">Achievements</button>
					</div>
					<div class="deck-pagination" data-pagination hidden>
						<button type="button" data-previous aria-label="Previous project">${icon("previous")}</button>
						<span data-position></span>
						<button type="button" data-next aria-label="Next project">${icon("next")}</button>
					</div>
				</div>
			</section>
			<section class="contributions" aria-label="GitHub contributions">
				<h2 data-contribution-total>Contributions</h2>
				<p class="graph-message" data-graph-message role="status" hidden></p>
				<div class="graph-scroll" data-graph-scroll role="region" aria-label="Contribution calendar, scroll horizontally for more dates" tabindex="0" hidden>
					<div class="graph-grid" data-graph-grid role="img"></div>
				</div>
				<noscript><a href="${escapeHtml(profile.github)}">View contributions on GitHub</a></noscript>
			</section>
`;

export default function Home() {
	return (
		<>
			<JsonLd data={getProfilePageSchema("", `${profile.name} | ${profile.tagline}`)} />
			<PortfolioPage page="home" content={content} />
			<Script src="/new-portfolio/portfolio.js" strategy="afterInteractive" />
		</>
	);
}
