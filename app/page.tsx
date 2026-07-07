import Hero from "./components/Hero";
import SkillStrip from "./components/SkillStrip";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-background">
      <Hero />
      <SkillStrip />
    </main>
  );
}
