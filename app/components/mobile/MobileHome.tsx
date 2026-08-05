import MobileHeroSection from "./MobileHeroSection";
export default function MobileHome() {
	return (
		<div className="xl:hidden flex-1 flex flex-col bg-background overflow-x-clip">
			<div className="@container mx-auto w-full max-w-2xl grow border-x-[3px] border-border px-fluid-sm py-fluid-sm flex flex-col gap-fluid-md">
				<MobileHeroSection />
				
			</div>
		</div>
	);
}
