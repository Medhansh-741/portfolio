import { NextResponse } from "next/server";
import {
  GithubContributionsSchema,
  GithubUserSchema,
  GithubReposArraySchema,
} from "@/app/lib/schemas";

export const revalidate = 3600; // Cache on server for 1 hour

const LANG_COLORS: Record<string, string> = {
  Python: "var(--color-accent-secondary)",
  TypeScript: "var(--color-accent-warning)",
  "C++": "var(--color-accent)",
  JavaScript: "#f1e05a",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  HTML: "#e34c26",
  CSS: "#563d7c",
};

const LANG_SHORT: Record<string, string> = {
  Python: "PY",
  TypeScript: "TS",
  "C++": "C++",
  JavaScript: "JS",
  Java: "JAVA",
  Go: "GO",
  Rust: "RS",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") || process.env.GITHUB_USERNAME || "Medhansh-741";
  const token = process.env.GITHUB_TOKEN;

  const authHeaders: Record<string, string> = {
    "User-Agent": "Portfolio-App",
    Accept: "application/vnd.github.v3+json",
  };
  if (token) {
    authHeaders["Authorization"] = `Bearer ${token}`;
  }

  try {
    const [contribRes, userRes, reposRes] = await Promise.allSettled([
      fetch(`https://github-contributions-api.jogruber.de/v4/${username}`, {
        next: { revalidate: 3600 },
        headers: { "User-Agent": "Portfolio-App" },
      }),
      fetch(`https://api.github.com/users/${username}`, {
        next: { revalidate: 3600 },
        headers: authHeaders,
      }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&type=owner`, {
        next: { revalidate: 3600 },
        headers: authHeaders,
      }),
    ]);

    let contribData = { total: {}, contributions: [] };
    if (contribRes.status === "fulfilled" && contribRes.value.ok) {
      const rawJson = await contribRes.value.json();
      const parsed = GithubContributionsSchema.safeParse(rawJson);
      if (parsed.success && parsed.data) {
        contribData = parsed.data as any;
      }
    }

    let publicRepos = 14;
    if (userRes.status === "fulfilled" && userRes.value.ok) {
      const rawJson = await userRes.value.json();
      const parsed = GithubUserSchema.safeParse(rawJson);
      if (parsed.success && typeof parsed.data.public_repos === "number") {
        publicRepos = parsed.data.public_repos;
      }
    }

    let totalStars = 24;
    const langCounts: Record<string, number> = {};

    if (reposRes.status === "fulfilled" && reposRes.value.ok) {
      const rawJson = await reposRes.value.json();
      const parsed = GithubReposArraySchema.safeParse(rawJson);
      if (parsed.success && parsed.data.length > 0) {
        let starsSum = 0;
        parsed.data.forEach((repo) => {
          if (!repo.fork) {
            starsSum += repo.stargazers_count;
            if (repo.language) {
              langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
            }
          }
        });
        totalStars = starsSum;
      }
    }

    // Process top 3 languages
    const totalLangRepos = Object.values(langCounts).reduce((a, b) => a + b, 0) || 1;
    const sortedLangs = Object.entries(langCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    const topLanguages = sortedLangs.map(([name, count], index) => {
      const pct = Math.round((count / totalLangRepos) * 100);
      const defaultColors = ["var(--color-accent-secondary)", "var(--color-accent-warning)", "var(--color-accent)"];
      return {
        name,
        shortName: LANG_SHORT[name] || name.substring(0, 4).toUpperCase(),
        percentage: pct,
        color: LANG_COLORS[name] || defaultColors[index % defaultColors.length],
      };
    });

    // Fallback if no language data was returned
    if (topLanguages.length === 0) {
      topLanguages.push(
        { name: "Python", shortName: "PY", percentage: 65, color: "var(--color-accent-secondary)" },
        { name: "TypeScript", shortName: "TS", percentage: 25, color: "var(--color-accent-warning)" },
        { name: "C++", shortName: "C++", percentage: 10, color: "var(--color-accent)" }
      );
    }

    const payload = {
      ...contribData,
      stats: {
        publicRepos,
        totalStars,
        topLanguages,
      },
    };

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error in GitHub proxy:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub data" },
      { status: 500 }
    );
  }
}
