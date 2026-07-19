import Hero from "./components/Hero";
import SkillStrip from "./components/SkillStrip";
import GithubCalendar from "./components/GithubCalendar";
import LeetCodeWidget from "./components/LeetCodeWidget";
import CodeforcesWidget from "./components/CodeforcesWidget";
import CommitFeed from "./components/CommitFeed";
import GithubStatsWidget from "./components/GithubStatsWidget";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-background">
      <Hero
        githubCalendar={<GithubCalendar />}
        leetCodeWidget={<LeetCodeWidget style={{ height: "32%" }} delay={0.55} />}
        codeforcesWidget={<CodeforcesWidget style={{ height: "32%" }} delay={0.65} />}
        commitFeed={<CommitFeed style={{ height: "64%" }} delay={0.7} />}
        githubStatsWidget={<GithubStatsWidget style={{ height: "32%" }} delay={0.75} />}
      />
      <SkillStrip />
    </main>
  );
}
