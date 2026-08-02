import GithubCalendarUI from "./GithubCalendarUI";
import { getGithubData, getLeetcodeData, getCodeforcesData } from "@/app/lib/api-fetchers";

export default async function GithubCalendar() {
  const [githubData, leetcodeData, codeforcesData] = await Promise.all([
    getGithubData(),
    getLeetcodeData(),
    getCodeforcesData(),
  ]);

  return (
    <GithubCalendarUI
      githubData={githubData}
      leetcodeData={leetcodeData.calendar || {}}
      codeforcesData={codeforcesData.calendar || {}}
    />
  );
}
