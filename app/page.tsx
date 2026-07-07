import Hero from "./components/Hero";
import SkillStrip from "./components/SkillStrip";
import HomeNav from "./components/HomeNav";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <SkillStrip />
      <HomeNav />
    </main>
  );
}
