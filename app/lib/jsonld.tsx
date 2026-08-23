import { profile, type Project } from "@/app/data/profile";

export const SITE_URL = "https://medhanshk.me";
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * Generates the canonical Schema.org Person entity for Medhansh Kapoor.
 * Unifies all identities, skills, affiliations, and verified social profiles.
 */
export function getPersonSchema() {
	const allSkills = Array.from(
		new Set(Object.values(profile.skills).flat())
	);

	return {
		"@type": "Person",
		"@id": PERSON_ID,
		name: profile.name,
		alternateName: ["Medhansh", "Medhansh-741"],
		url: SITE_URL,
		jobTitle: "AI/ML Engineer & Full-Stack Developer",
		disambiguatingDescription:
			"AI/ML Engineer & Full-Stack Developer based in Jaipur, India with completed engineering internships at IndiaAI Mission (MeitY), ISSA-DRDO, and Geminid Systems.",
		description: profile.intro,
		email: `mailto:${profile.email}`,
		telephone: profile.phone,
		address: {
			"@type": "PostalAddress",
			addressLocality: "Jaipur",
			addressCountry: "IN",
		},
		sameAs: [
			profile.github,
			profile.linkedin,
			profile.x,
			profile.instagram,
			profile.cal,
		].filter(Boolean),
		alumniOf: profile.education.map((edu) => ({
			"@type": "EducationalOrganization",
			name: edu.institution,
		})),
		hasOccupation: profile.experience.map((exp) => ({
			"@type": "Occupation",
			name: exp.role,
			description: exp.description,
			occupationLocation: {
				"@type": "AdministrativeArea",
				name: exp.company,
			},
		})),
		knowsAbout: allSkills,
	};
}

/**
 * Generates the canonical WebSite schema linking author and publisher to the Person entity.
 */
export function getWebSiteSchema() {
	return {
		"@type": "WebSite",
		"@id": WEBSITE_ID,
		url: SITE_URL,
		name: profile.name,
		description:
			"Portfolio of Medhansh Kapoor — AI/ML Engineer and Full-Stack Developer based in Jaipur, India.",
		publisher: {
			"@id": PERSON_ID,
		},
		author: {
			"@id": PERSON_ID,
		},
	};
}

/**
 * Generates the root graph combining WebSite and Person for global site recognition.
 */
export function getRootGraphSchema() {
	return {
		"@context": "https://schema.org",
		"@graph": [getWebSiteSchema(), getPersonSchema()],
	};
}

/**
 * Generates ProfilePage schema linking back to the Person entity.
 */
export function getProfilePageSchema(path = "", title = "Medhansh Kapoor", description = profile.intro) {
	const pageUrl = `${SITE_URL}${path}`;
	return {
		"@context": "https://schema.org",
		"@type": "ProfilePage",
		"@id": `${pageUrl}/#profilepage`,
		url: pageUrl,
		name: title,
		description,
		dateModified: "2026-08-23",
		isPartOf: {
			"@id": WEBSITE_ID,
		},
		mainEntity: {
			"@id": PERSON_ID,
		},
		speakable: {
			"@type": "SpeakableSpecification",
			cssSelector: ["h1", "p"],
		},
	};
}

/**
 * Generates CollectionPage + ItemList for projects with SoftwareApplication entities.
 */
export function getProjectsCollectionSchema() {
	const pageUrl = `${SITE_URL}/projects`;
	return {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		"@id": `${pageUrl}/#collection`,
		url: pageUrl,
		name: "Projects — Medhansh Kapoor",
		description:
			"Explore production AI systems built by Medhansh Kapoor, including JanSamadhan (autonomous civic surveillance) and NyayaAI (multi-agent legal platform).",
		dateModified: "2026-08-23",
		isPartOf: {
			"@id": WEBSITE_ID,
		},
		mainEntity: {
			"@type": "ItemList",
			itemListElement: profile.projects.map((proj, index) => ({
				"@type": "ListItem",
				position: index + 1,
				item: {
					"@type": "SoftwareApplication",
					name: proj.title,
					description: proj.description,
					applicationCategory: "AI / Machine Learning Application",
					operatingSystem: "Web",
					url: proj.links.live,
					sameAs: proj.links.github,
					author: {
						"@id": PERSON_ID,
					},
				},
			})),
		},
	};
}

/**
 * Generates WebPage schema for /experience linking to the canonical Person.
 */
export function getExperiencePageSchema() {
	const pageUrl = `${SITE_URL}/experience`;
	return {
		"@context": "https://schema.org",
		"@type": "WebPage",
		"@id": `${pageUrl}/#webpage`,
		url: pageUrl,
		name: "Experience — Medhansh Kapoor",
		description:
			"Professional engineering experience of Medhansh Kapoor — AI/ML roles at IndiaAI Mission (MeitY), ISSA-DRDO, and Geminid Systems.",
		dateModified: "2026-08-23",
		isPartOf: {
			"@id": WEBSITE_ID,
		},
		mainEntity: {
			"@id": PERSON_ID,
		},
	};
}

/**
 * Generates ItemPage + SoftwareApplication schema for a dedicated project page (/projects/[slug]).
 */
export function getSingleProjectSchema(project: Project, slug: string) {
	const pageUrl = `${SITE_URL}/projects/${slug}`;
	const videoFileName = project.title.toLowerCase().replace(/\s+/g, "");
	const imageUrl = `${SITE_URL}/videos/${videoFileName}.webp`;

	return {
		"@context": "https://schema.org",
		"@type": "ItemPage",
		"@id": `${pageUrl}/#webpage`,
		url: pageUrl,
		name: project.title,
		description: project.description,
		dateModified: "2026-08-23",
		isPartOf: {
			"@id": WEBSITE_ID,
		},
		mainEntity: {
			"@type": "SoftwareApplication",
			"@id": `${pageUrl}/#software`,
			name: project.title,
			description: project.description,
			applicationCategory: "AI / Machine Learning Application",
			operatingSystem: "Web",
			url: project.links.live,
			image: imageUrl,
			sameAs: [project.links.github, project.links.demo].filter(Boolean),
			author: {
				"@id": PERSON_ID,
			},
			offers: {
				"@type": "Offer",
				price: "0",
				priceCurrency: "USD",
			},
		},
	};
}

/**
 * Safe JSON-LD Server Component with XSS sanitation.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{
				__html: JSON.stringify(data).replace(/</g, "\\u003c"),
			}}
		/>
	);
}
