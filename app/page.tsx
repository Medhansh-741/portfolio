import GridHero from "./components/GridHero";
import SkillStrip from "./components/SkillStrip";
import GithubCalendar from "./components/GithubCalendar";
import LeetCodeWidget from "./components/LeetCodeWidget";
import CodeforcesWidget from "./components/CodeforcesWidget";
import CommitFeed from "./components/CommitFeed";
import GithubStatsWidget from "./components/GithubStatsWidget";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col bg-background overflow-visible xl:[@media(min-height:768px)]:overflow-hidden">
      <GridHero
        githubCalendar={<GithubCalendar />}
        leetCodeWidget={<LeetCodeWidget delay={0.55} />}
        codeforcesWidget={<CodeforcesWidget delay={0.65} />}
        commitFeed={<CommitFeed delay={0.7} />}
        githubStatsWidget={<GithubStatsWidget delay={0.75} />}
      />
      <div className="hidden xl:block mt-auto">
        <SkillStrip />
      </div>
    </main>
  );
}
