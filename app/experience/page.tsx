import type { Metadata } from "next";
import ExperienceView from "./ExperienceView";

export const metadata: Metadata = {
	title: "Experience",
	description:
		"Professional engineering experience of Medhansh Kapoor — AI/ML roles at IndiaAI Mission (MeitY), ISSA-DRDO (Ministry of Defence), and Geminid Systems.",
	alternates: {
		canonical: "/experience",
	},
	openGraph: {
		title: "Experience — Medhansh Kapoor",
		description:
			"Professional engineering experience of Medhansh Kapoor — AI/ML roles at IndiaAI Mission (MeitY), ISSA-DRDO (Ministry of Defence), and Geminid Systems.",
		url: "/experience",
		type: "website",
	},
	twitter: {
		card: "summary",
		title: "Experience — Medhansh Kapoor",
		description:
			"Professional engineering experience of Medhansh Kapoor — AI/ML roles at IndiaAI Mission (MeitY), ISSA-DRDO (Ministry of Defence), and Geminid Systems.",
	},
};

export default function ExperiencePage() {
	return <ExperienceView />;
}
