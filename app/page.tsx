import DesktopOnly from "./components/desktop/DesktopOnly";
import HeroSection from "./components/HeroSection";
import MobileHome from "./components/mobile/MobileHome";
import SkillStrip from "./components/SkillStrip";

export default function Home() {
	return (
		<>
			<main className="hidden xl:flex flex-1 flex-col bg-background overflow-visible xl:[@media(min-height:768px)]:overflow-hidden">
				<section className="w-full px-6 md:px-12 pt-3 md:pt-4 xl:pt-6 pb-6 flex-grow min-h-0 flex flex-col relative overflow-x-hidden overflow-y-visible xl:[@media(min-height:768px)]:overflow-hidden">
					<div className="w-full h-auto xl:[@media(min-height:768px)]:h-full xl:[@media(min-height:768px)]:max-h-[900px] xl:[@media(min-height:768px)]:my-auto min-h-0 flex flex-col">
						<div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_repeat(3,240px)] xl:[@media(max-height:767px)]:grid-rows-[minmax(250px,55vh)_auto] xl:[@media(min-height:768px)]:grid-rows-[minmax(0,2fr)_minmax(0,1fr)] gap-4 h-auto xl:[@media(min-height:768px)]:h-full">
							<div className="h-full min-h-0 flex flex-col justify-start clip-margin-5">
								<HeroSection />
							</div>
							<DesktopOnly />
						</div>
					</div>
				</section>
				<div className="hidden xl:block mt-auto">
					<SkillStrip />
				</div>
			</main>
			<MobileHome />
		</>
	);
}
