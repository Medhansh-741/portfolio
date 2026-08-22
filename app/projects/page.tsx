import type { Metadata } from "next";
import ProjectsView from "./ProjectsView";

export const metadata: Metadata = {
	title: "Projects",
	description:
		"Explore production AI systems built by Medhansh Kapoor, including JanSamadhan (autonomous civic surveillance) and NyayaAI (multi-agent legal platform).",
	alternates: {
		canonical: "/projects",
	},
	openGraph: {
		title: "Projects — Medhansh Kapoor",
		description:
			"Explore production AI systems built by Medhansh Kapoor, including JanSamadhan (autonomous civic surveillance) and NyayaAI (multi-agent legal platform).",
		url: "/projects",
		type: "website",
	},
	twitter: {
		card: "summary",
		title: "Projects — Medhansh Kapoor",
		description:
			"Explore production AI systems built by Medhansh Kapoor, including JanSamadhan (autonomous civic surveillance) and NyayaAI (multi-agent legal platform).",
	},
};

export default function ProjectsPage() {
	return <ProjectsView />;
}
