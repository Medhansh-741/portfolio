"use client";
import AnimatedCell from "../AnimatedCell";
import CodeforcesWidget from "../CodeforcesWidget";
import CommitFeed from "../CommitFeed";
import ExperienceCard from "../ExperienceCard";
import GithubCalendar from "../GithubCalendar";
import GithubStatsWidget from "../GithubStatsWidget";
import LeetCodeWidget from "../LeetCodeWidget";
import ProjectsDrawer from "../ProjectsDrawer";

export default function DesktopGrid() {
	return (
		<>
			<div className="h-full min-h-0 flex flex-col clip-margin-5">
				<ExperienceCard delay={0.5} />
			</div>
			<div className="h-full min-h-0 flex flex-col clip-margin-5">
				<ProjectsDrawer delay={0.6} />
			</div>
			<div className="h-full min-h-0 flex flex-col clip-margin-5">
				<CommitFeed delay={0.7} />
			</div>
			<div className="h-full min-h-0 flex flex-col clip-margin-5">
				<AnimatedCell
					delay={0.5}
					className="h-full w-full flex flex-col justify-end"
				>
					<GithubCalendar />
				</AnimatedCell>
			</div>
			<div className="h-full min-h-0 flex flex-col clip-margin-5">
				<LeetCodeWidget delay={0.55} />
			</div>
			<div className="h-full min-h-0 flex flex-col clip-margin-5">
				<CodeforcesWidget delay={0.65} />
			</div>
			<div className="h-full min-h-0 flex flex-col clip-margin-5">
				<GithubStatsWidget delay={0.75} />
			</div>
		</>
	);
}
