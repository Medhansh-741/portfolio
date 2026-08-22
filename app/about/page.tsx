import type { Metadata } from "next";
import AboutView from "./AboutView";
import { JsonLd, getProfilePageSchema } from "@/app/lib/jsonld";

export const metadata: Metadata = {
	title: "About",
	description:
		"Medhansh Kapoor-AI/ML Engineer & Full-Stack Developer in Jaipur, India. Designing end-to-end systems from user problem to architecture.",
	alternates: {
		canonical: "/about",
	},
	openGraph: {
		title: "About — Medhansh Kapoor",
		description:
			"Medhansh Kapoor-AI/ML Engineer & Full-Stack Developer in Jaipur, India. Designing end-to-end systems from user problem to architecture.",
		url: "/about",
		type: "website",
	},
	twitter: {
		card: "summary",
		title: "About — Medhansh Kapoor",
		description:
			"Medhansh Kapoor-AI/ML Engineer & Full-Stack Developer in Jaipur, India. Designing end-to-end systems from user problem to architecture.",
	},
};

export default function AboutPage() {
	return (
		<>
			<JsonLd
				data={getProfilePageSchema(
					"/about",
					"About — Medhansh Kapoor",
					"Medhansh Kapoor — AI/ML Engineer & Full-Stack Developer based in Jaipur, India. Engineering philosophy, achievements, and education."
				)}
			/>
			<AboutView />
		</>
	);
}
