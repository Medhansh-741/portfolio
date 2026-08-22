import type { Metadata } from "next";
import ProjectsView from "./ProjectsView";

export const metadata: Metadata = {
	title: "Projects | Medhansh Kapoor",
	alternates: {
		canonical: "/projects",
	},
};

export default function ProjectsPage() {
	return <ProjectsView />;
}
