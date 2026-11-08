type Achievement = {
	title: string;
	detail?: string;
	award?: true;
	certificate?: string;
	eventUrl?: string;
	images?: readonly { src: string; alt: string; width: number; height: number }[];
};

const achievements: readonly Achievement[] = [
	{
		title: "First Prize at Claude Impact Lab Bhopal",
		detail: "My team won first prize in October 2026 for tackling a real government challenge at Claude Impact Lab, held in collaboration with MPSeDC and the Government of Madhya Pradesh.",
		award: true,
		eventUrl: "https://luma.com/claude-ozni",
		images: [
			{ src: "/new-portfolio/claude-impact-lab.webp", alt: "Group photo at the Manipal University Jaipur recognition for the Claude Impact Lab first prize", width: 1200, height: 800 },
			{ src: "/new-portfolio/claude-impact-lab-demo.webp", alt: "The team presenting at the lectern", width: 1200, height: 800 },
			{ src: "/new-portfolio/claude-impact-lab-team.webp", alt: "The team speaking with a university official on stage", width: 1200, height: 800 },
			{ src: "/new-portfolio/claude-impact-lab-audience.webp", alt: "Medhansh Kapoor and Prakhar Gupta seated with university officials", width: 800, height: 533 },
		],
	},
	{
		title: "Certificate of Student Excellence, Manipal University Jaipur (2026)",
		award: true,
		images: [
			{ src: "/new-portfolio/student-excellence-2026.webp", alt: "Manipal University Jaipur Certificate of Student Excellence awarded to Medhansh Kapoor in 2026", width: 800, height: 565 },
		],
	},
	{
		title: "India Innovates '26, National Finalist",
		detail: "Winner in Digital Democracy track; presented JanSamadhan live before senior policy leaders at Bharat Mandapam; project forwarded to central ministries.",
		certificate: "/India-Innovates.pdf",
	},
	{
		title: "Prayatna 3.0 Hackathon, Finalist",
		detail: "Built NyayaAI's 5-agent legal AI backend during a 36-hour sprint.",
		certificate: "/Prayatna-3.0.pdf",
	},
];

export const profile = {
	name: "Medhansh Kapoor",
	tagline: "AI/ML Engineer | Full-Stack Developer",
	disambiguation:
		"Distinct from other individuals of the same name, including the filmmaker/photographer at medhanshk.com and medical professionals.",
	intro:
		"I take problems from the user experience down to technical architecture, building a working first-draft pipeline, learning as the solution demands, and dialing it in checkpoint by checkpoint.",
	email: "medhansh541@gmail.com",
	phone: "+91 8368680865",
	location: "Jaipur, India",
	github: "https://github.com/Medhansh-741",
	linkedin: "https://www.linkedin.com/in/medhansh-kapoor",
	x: "https://x.com/medhansh541",
	instagram: "https://www.instagram.com/medhansh341/",
	cal: "https://cal.com/medhansh541",
	resumeUrl: "/resume.pdf",
	about: [
		"I build by jumping in headfirst. Every project is an excuse to explore a stack I haven't mastered yet, a problem that feels just out of reach, or an architecture I haven't tried. I think in systems, not features: connecting ideas across AI, infrastructure, and full-stack to build solutions that hold up under pressure. I don't stay comfortable. I learn by doing, I ship fast, and I believe code should scale beyond its first use case.",
		"AI/ML Engineer and Full-Stack Developer with hands-on experience building production-grade AI agents, geospatial intelligence systems, and civic-tech platforms across engineering internships at IndiaAI Mission (MeitY), ISSA-DRDO, and Geminid Systems.",
		"I specialize in FastAPI, Next.js, PyTorch, LangGraph, and PostgreSQL — with a strong focus on AI agent orchestration, RAG pipelines, real-time systems, and full-stack deployment. I build things that work in the real world, not just in notebooks.",
	],
	skills: {
		Languages: ["Python", "TypeScript", "JavaScript", "SQL", "C", "C++"],
		"Backend / Web": [
			"FastAPI",
			"Next.js",
			"Node.js",
			"React",
			"Celery",
			"Pydantic",
			"Supabase",
			"Git",
		],
		"Applied AI": [
			"PyTorch",
			"LangGraph",
			"LangChain",
			"LlamaIndex",
			"YOLOv8",
			"ONNX",
			"OpenCV",
			"Sentence Transformers",
		],
		"Data / Infra / MLOps": [
			"PostgreSQL",
			"PostGIS",
			"Qdrant",
			"Neo4j",
			"Redis",
			"SQLite",
			"GDAL",
			"GeoServer",
			"Martin Tile Server",
			"OpenLayers",
			"AWS S3",
			"GCP",
			"Docker",
			"Podman",
			"RHEL",
			"Ubuntu",
		],
	},
	experience: [
		{
			company: "IndiaAI Mission (MeitY)",
			role: "AI/ML Intern",
			period: "June 2026 – July 2026",
			description:
				"Built an AIKosh toolkit that accepts health research uploads, checks data quality and privacy across 15 areas, and automatically generates reports and sends verified dataset details.",
			tech: [
				"Next.js",
				"FastAPI",
				"Celery",
				"Redis",
				"Supabase (PostgreSQL)",
				"AWS S3",
				"Pydantic",
				"JWT Auth",
				"Jinja2",
				"WeasyPrint",
			],
			highlights: [
				"Metadata Intake: Engineered an 8-step wizard with pre-signed URLs for direct-to-storage uploads, bypassing the backend to enhance security and reduce server load.",
				"Assessment Engine: Architected an asynchronous, parallelized scoring engine to evaluate datasets across 15 government-defined quality domains, generating Composite Quality and Privacy Risk scores for automated release eligibility (Open/Controlled/Restricted).",
				"Integration: Built automated multi-format reporting (JSON/HTML/PDF) and webhook APIs, enabling AIKosh to auto-ingest verified dataset metadata upon assessment completion.",
			],
			offerLetter: "/MEITY-offer-letter.pdf",
			completionLetter: "/MEITY-completion-letter.pdf",
		},
		{
			company: "ISSA – DRDO",
			role: "Student Trainee, Ministry of Defence",
			period: "May 2026 – July 2026",
			description:
				"Built an offline mapping platform that automatically imports map files and imagery and serves interactive maps in a browser over a secure local network.",
			tech: [
				"FastAPI",
				"PostGIS",
				"GDAL/ogr2ogr",
				"GeoServer",
				"Martin Tile Server",
				"OpenLayers",
				"Docker/Podman",
				"RHEL",
			],
			highlights: [
				"Ingestion Pipelines: Built automated ETL pipelines for vector (Shapefiles to PostGIS with reprojection/indexing) and raster data (GeoTIFFs auto-published via REST), eliminating manual GIS server setups.",
				"Serving Layer & Infra: Enabled real-time map-tile delivery to browser clients via a containerized 4-service microservices backend, securely deployed on a firewalled RHEL environment for fully offline, classified operations.",
			],
			offerLetter: "/DRDO-offer-letter.pdf",
			completionLetter: "/DRDO-completion-letter.pdf",
		},
		{
			company: "Geminid Systems",
			role: "Software Development Intern",
			period: "May 2026 – June 2026",
			description:
				"Built and tested Salesforce integrations, compared AI tools that turn questions into database queries, and benchmarked audio tools for voice analytics.",
			tech: [
				"Vanna.ai",
				"LlamaIndex",
				"LangChain",
				"Librosa",
				"PyDub",
				"Torchaudio",
				"Salesforce Apex",
				"Einstein AI",
				"Agentforce",
			],
			highlights: [
				"Benchmarking: Evaluated Vanna.ai, LlamaIndex, LangChain for NL-to-SQL, and audio frameworks (Librosa, PyDub) for feature extraction; identified that agent architecture outweighs model choice for multi-table reasoning.",
				"Salesforce AI Platform: Built Apex REST services and SOAP integrations; conducted prompt engineering experiments on live CRM data using Einstein AI and Agentforce.",
			],
			offerLetter: "/Geminid-offer-letter.pdf",
			completionLetter: "/Geminid-completion-letter.pdf",
		},
	],
	projects: [
		{
			title: "JanSamadhan",
			subtitle: "Autonomous Civic Surveillance Platform",
			period: "Mar 2026",
			description:
				"JanSamadhan turns vetted CCTV and dashcam detections into civic repair tickets and takes citizen reports by chat, voice, or WhatsApp. Seva uses Gemini to classify reports and route them to the right Delhi department. India's DIGIPIN pinpoints issues, and residents can upvote nearby duplicates instead of filing again. Upvotes and missed deadlines raise priority, while public maps and ticket history show progress. Workers upload repair proof, camera rescans check the fix, and residents can confirm or reopen tickets. Field evidence feeds future model training.",
			tech: [
				"YOLOv8",
				"ONNX",
				"OpenCV",
				"FastAPI",
				"PostgreSQL/PostGIS",
				"Gemini 2.5",
			],

			highlights: [
				"Model & Inference: Trained YOLOv8 on 4,783 images with 30% engineered negatives and FN-bucketing for recall diagnosis; achieved 20ms ONNX inference on a FastAPI microservice deployed via GCP Cloud Run.",
				"Auto-Ticketing & Reliability: Engineered a burst-frame extraction pipeline feeding a 4-tier reliability engine and DIGIPIN-based deduplication, processing 256 end-to-end complaints in 0.36s per ticket.",
				"Verification & Active Learning: Enforced automated post-repair rescans to verify fixes before ticket closure; bucketed field data into labeled classes for continuous baseline-gated retraining.",
				"LLM Routing (Seva): Integrated Gemini 2.5 Flash using a 4-step Chain-of-Thought to autonomously route complaints across 42 civic categories, auto-routing 125/256 tickets with zero manual input.",
			],
			links: {
				live: "https://jansamadhan.perkkk.dev/",
				github: "https://github.com/Medhansh-741/ps-crmdev1",
				demo: "https://youtu.be/JvkJd1MAV3M",
			},
		},
		{
			title: "NyayaAI",
			subtitle: "Multi-Agent Legal Intelligence Platform",
			period: "Mar 2026 (36-hr Sprint)",
			description:
				"5-agent pipeline: legal case in — research, strategy, drafted documents, and reasoned explainability out.",
			tech: [
				"LangGraph",
				"FastAPI",
				"Qdrant",
				"Neo4j",
				"Redis",
				"WebSockets",
				"Celery",
				"Groq",
				"Gemini",
			],

			highlights: [
				"Orchestration & Intake: Built a stateful 5-stage LangGraph pipeline (Intake → Research → Strategy → Drafting → Explainability) with OCR-aware processing and SHA-256 caching to mitigate LLM hallucinations.",
				"RAG & Determinism: Indexed 4,582 chunks (7 legal acts) in Qdrant via Sentence Transformers; engineered a diagnostic harness to catch retrieval drift and OCR instability across N-run tests.",
				"Reliability & Graph: Implemented a triple-engine fallback (Groq → Gemini → offline rules) for zero-downtime generation; built a Neo4j legal knowledge graph (1,410 nodes, 1,837 relationships) for explainable document drafting.",
				"Realtime Infrastructure: Developed an event-driven custom Redis Pub/Sub, WebSockets, and Celery backend for live citizen-lawyer negotiation chat, bypassing third-party APIs.",
			],
			links: {
				live: "https://nyay-ai-liard.vercel.app/",
				github: "https://github.com/Medhansh-741/NyayAI",
				demo: "https://youtu.be/YwgooAeuRmo",
			},
		},
		{
			title: "Ecoaudit",
			subtitle: "Software Sustainability Auditor",
			period: "Oct 2026",
			description:
				"Ecoaudit is an open-source tool that finds avoidable compute waste using rule-based checks, with no LLM or machine learning. It reads code from a public GitHub repo or a local Git checkout without running it. You can add existing deployment logs through read-only AWS IAM access and artifacts such as profiles or test reports from runs in your own environment. Ecoaudit checks that evidence against its rules, and you can run the entire app on localhost to keep your code and artifacts private.",
			tech: ["Python", "TypeScript", "GitHub Actions", "AWS Lambda", "Amazon S3", "Lighthouse"],
			highlights: [
				"Performance profiling: Built a GitHub Action that collects Python CPU and memory profiles and runs Lighthouse, then uploads the results for analysis.",
				"Database checks: Added detectors that flag wasteful SQL patterns and query plans, including sequential scans inside nested loops.",
				"Report storage: Updated the Lighthouse worker to save JSON and HTML reports to private S3 and added a live demo script.",
			],
			posterOnly: true,
			collaborative: true,
			applicationCategory: "DeveloperApplication",
			links: {
				live: "https://main.dz3ac51z9uzpr.amplifyapp.com/",
				github: "https://github.com/AWS-env/environmental-hacks/",
				demo: "https://www.youtube.com/watch?v=YWgCT_omVGM",
			},
		},
	],
	achievements,
	education: [
		{
			institution: "Manipal University Jaipur",
			degree: "Bachelor of Technology in Computer Science & Engineering",
			period: "Aug 2025 – 2029",
		},
		{
			institution: "VVDAV Public School, New Delhi",
			degree: "CBSE Class XII, PCM + Computer Science",
			period: "2024",
		},
	],
};

export type Project = (typeof profile)["projects"][number];

/**
 * Canonical helper to derive consistent project URL slugs from titles.
 */
export function getProjectSlug(title: string): string {
	return title.toLowerCase().replace(/\s+/g, "-");
}

export interface NavRoute {
	name: string;
	path: string;
	description: string;
}

/**
 * Centralized static navigation routes derived for Sitelinks, Sitemaps, and Breadcrumbs.
 */
export const staticRoutes: NavRoute[] = [
	{
		name: "Projects",
		path: "/projects",
		description:
			"Explore Medhansh Kapoor’s work on JanSamadhan, NyayaAI, and Ecoaudit.",
	},
	{
		name: "Experience",
		path: "/experience",
		description:
			"Professional AI/ML engineering experience at IndiaAI Mission (MeitY), ISSA-DRDO, and Geminid Systems.",
	},
	{
		name: "About",
		path: "/about",
		description:
			"About Medhansh Kapoor, including his engineering background, first prize at Claude Impact Lab Bhopal, and Student Excellence award at Manipal University Jaipur.",
	},
	{
		name: "Resume",
		path: profile.resumeUrl,
		description:
			"Official Curriculum Vitae & Resume of Medhansh Kapoor (PDF).",
	},
];

/**
 * Dynamically synthesizes the canonical disambiguation description from profile data.
 */
export function getDisambiguatingDescription(p = profile): string {
	const projectsList = p.projects.map((proj) => proj.title).join(" and ");
	const companiesList = p.experience.map((exp) => exp.company).join(", ");
	return `${p.tagline} based in ${p.location} (projects include ${projectsList}, with completed engineering internships at ${companiesList}; ${p.disambiguation || ""})`.trim();
}
