import Hero from "./components/Hero";
import SkillStrip from "./components/SkillStrip";
import HomeNav from "./components/HomeNav";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-background">
      <Hero />
      <SkillStrip />
      <HomeNav />
    </main>
  );
}
