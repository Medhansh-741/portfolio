export const profile = {
	name: "Medhansh Kapoor",
	tagline: "AI/ML Engineer | Full-Stack Developer",
	email: "medhansh541@gmail.com",
	phone: "+91 8368680865",
	location: "Jaipur, India",
	github: "https://github.com/Medhansh-741/",
	linkedin: "https://www.linkedin.com/in/medhansh-kapoor",
	resumeUrl: "/resume.pdf",
	about: [
		"AI/ML Engineer and Full-Stack Developer with hands-on experience building production-grade AI agents, geospatial intelligence systems, and civic-tech platforms. Currently working under IndiaAI Mission (MeitY) and ISSA-DRDO on high-impact national projects.",
		"I specialize in FastAPI, Next.js, PyTorch, LangGraph, and PostgreSQL — with a strong focus on AI agent orchestration, RAG pipelines, real-time systems, and full-stack deployment. I build things that work in the real world, not just in notebooks.",
	],
	skills: {
		Languages: ["Python", "TypeScript", "JavaScript", "SQL", "C", "C++"],
		"Backend / Web": [
			"FastAPI",
			"REST APIs",
			"Next.js",
			"Node.js",
			"WebSockets",
			"Celery",
			"Pydantic",
			"React",
			"Supabase",
			"Git",
		],
		"Applied AI": [
			"PyTorch",
			"LangGraph",
			"LangChain",
			"LlamaIndex",
			"RAG",
			"AI Agents",
			"Multi-agent Systems",
			"YOLOv8",
			"ONNX",
			"OpenCV",
			"Sentence Transformers",
			"Embeddings",
			"Semantic Search",
			"Prompt Engineering",
			"Function Calling",
			"Multimodal AI",
			"NLP",
		],
		"Data / Infra / MLOps": [
			"ETL Pipelines",
			"PostgreSQL",
			"PostGIS",
			"Vector/Graph Databases (Qdrant, Neo4j)",
			"Redis",
			"SQLite",
			"GDAL",
			"GeoServer",
			"Martin Tile Server",
			"OpenLayers",
			"AWS S3",
			"GCP",
			"Docker/Podman",
			"RHEL/Ubuntu",
		],
	},
	experience: [
		{
			company: "IndiaAI Mission (MeitY)",
			role: "AI/ML Intern",
			period: "Jun 2026 – Jul 2026",
			description:
				"Building a standalone dataset-quality evaluation toolkit for AIKosh (under MeitY's IndiaAI Mission) — bridging the ICMR MIDAS 2.0 framework gap, slated for production integration by internship end.",
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
			offerLetter:
				"https://drive.google.com/file/d/1Cgofwc6_vKuQzqllqIPQNVs77jcuh2yY/view?usp=sharing",
		},
		{
			company: "ISSA – DRDO",
			role: "Student Trainee, Ministry of Defence",
			period: "May 2026 – Jul 2026",
			description:
				"Building a self-contained, fully offline GIS platform enabling classified defence environments with no internet access to securely upload, process, and visualize geospatial map data.",
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
			offerLetter:
				"https://drive.google.com/file/d/1nezLkpd3oL3SE1_Na7hirCbjfAQfT7MQ/view?usp=sharing",
		},
		{
			company: "Geminid Systems",
			role: "Software Development Intern",
			period: "May 2026 – Jun 2026",
			description:
				"Evaluated enterprise AI toolchains and shipped production integration tests on live Salesforce CRM infrastructure.",
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
			offerLetter:
				"https://drive.google.com/file/d/1lYTnTJkTyrEQxvPpDEUys0IicQ8hXsRR/view?usp=sharing",
			completionLetter:
				"https://drive.google.com/file/d/1zbMoRUmxyGsiUCIy9RY1wZzFcYG-RgKs/view?usp=sharing",
		},
	],
	projects: [
		{
			title: "JanSamadhan",
			subtitle: "Autonomous Civic Surveillance Platform",
			period: "Mar 2026",
			description:
				"Detects civic issues via CCTV/dashcam, auto-generates complaint tickets, verifies repairs, and retrains itself.",
			tech: [
				"YOLOv8",
				"ONNX",
				"OpenCV",
				"FastAPI",
				"PostgreSQL/PostGIS",
				"Gemini 2.5",
			],
			metrics: "70.3% Precision | 57.7% Recall | 0.68 mAP50",
			highlights: [
				"Model & Inference: Trained YOLOv8 on 4,783 images with 30% engineered negatives and FN-bucketing for recall diagnosis; achieved 20ms ONNX inference on a FastAPI microservice deployed via GCP Cloud Run.",
				"Auto-Ticketing & Reliability: Engineered a burst-frame extraction pipeline feeding a 4-tier reliability engine and DIGIPIN geospatial deduplication (4m² grid), processing 256 end-to-end complaints in 0.36s per ticket.",
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
			metrics: "5-Agent Workflow | 11 Legal Domains",
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
	],
	achievements: [
		{
			title: "India Innovates '26 — National Finalist",
			detail:
				"Winner in Digital Democracy track; presented JanSamadhan live before senior policy leaders at Bharat Mandapam; project forwarded to central ministries.",
			certificate:
				"https://drive.google.com/file/d/1q9moT6B-zS8Gpz6VhfLKHbXZnHAJVAzI/view?usp=sharing",
		},
		{
			title: "Prayatna 3.0 Hackathon — Finalist",
			detail:
				"Built NyayaAI's 5-agent legal AI backend during a 36-hour sprint.",
			certificate:
				"https://drive.google.com/file/d/1p1OgIIgURi0Z65zSTpsrdA8R18z1nXyv/view?usp=sharing",
		},
	],
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
