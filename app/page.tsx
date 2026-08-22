import { Suspense } from "react";
import DesktopGrid from "./components/desktop/DesktopGrid";
import DesktopGridSkeleton from "./components/desktop/DesktopGridSkeleton";
import HeroSection from "./components/HeroSection";
import MobileHome from "./components/mobile/MobileHome";
import SkillStrip from "./components/SkillStrip";
import { JsonLd, getProfilePageSchema } from "./lib/jsonld";

export default function Home() {
	return (
		<>
			<JsonLd data={getProfilePageSchema("", "Medhansh Kapoor — AI/ML Engineer & Full-Stack Developer")} />
			<main className="hidden xl:flex flex-1 flex-col bg-background overflow-visible">
				<section className="w-full px-6 md:px-12 pt-3 md:pt-4 xl:pt-6 pb-6 min-h-0 flex-1 flex flex-col justify-center relative overflow-x-hidden">
					<div className="w-full max-w-[1824px] mx-auto h-auto min-h-0 flex flex-col">
						<div className="grid min-h-0 grid-cols-1 xl:grid-cols-[minmax(0,2.8fr)_repeat(3,minmax(0,1fr))] xl:grid-rows-[minmax(0,2fr)_minmax(0,1fr)] gap-4 aspect-[1824/732]">
							<div className="h-full min-h-0 flex flex-col justify-start clip-margin-5 [container-type:inline-size]">
								<HeroSection />
							</div>
							<Suspense fallback={<DesktopGridSkeleton />}>
								<DesktopGrid />
							</Suspense>
						</div>
					</div>
				</section>
			</main>
			<MobileHome />
			<footer className="hidden xl:block">
				<SkillStrip />
			</footer>
		</>
	);
}
