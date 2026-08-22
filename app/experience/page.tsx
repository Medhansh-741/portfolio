import type { Metadata } from "next";
import ExperienceView from "./ExperienceView";

export const metadata: Metadata = {
	title: "Experience | Medhansh Kapoor",
	alternates: {
		canonical: "/experience",
	},
};

export default function ExperiencePage() {
	return <ExperienceView />;
}
