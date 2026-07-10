import { NextResponse } from "next/server";

export const revalidate = 3600; // Cache on server for 1 hour

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") || "Medhansh_217";

  try {
    const urls = [
      `https://codeforces.com/api/user.info?handles=${username}`,
      `https://codeforces.com/api/user.status?handle=${username}`,
      `https://codeforces.com/api/user.rating?handle=${username}`,
    ];

    const [infoRes, statusRes, ratingRes] = await Promise.all(
      urls.map((url) =>
        fetch(url, {
          next: { revalidate: 3600 },
          headers: {
            "User-Agent": "Portfolio-App",
          },
        })
      )
    );

    let info = null;
    let solvedCount = 0;
    let contestCount = 0;
    const calendarMap: Record<string, number> = {};

    // 1. Process User Info
    if (infoRes.ok) {
      const infoJson = await infoRes.json();
      if (infoJson.status === "OK" && infoJson.result && infoJson.result.length > 0) {
        info = infoJson.result[0];
      }
    }

    // 2. Process Submissions for Solved Problems count & Calendar Grid
    if (statusRes.ok) {
      const statusJson = await statusRes.json();
      if (statusJson.status === "OK") {
        const solvedSet = new Set();
        statusJson.result.forEach((sub: any) => {
          if (sub.verdict === "OK" && sub.problem) {
            const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
            solvedSet.add(problemId);
          }
          
          if (sub.creationTimeSeconds) {
            const date = new Date(sub.creationTimeSeconds * 1000);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const dateStr = `${year}-${month}-${day}`;
            calendarMap[dateStr] = (calendarMap[dateStr] || 0) + 1;
          }
        });
        solvedCount = solvedSet.size;
      }
    }

    // 3. Process Contests Played count
    if (ratingRes.ok) {
      const ratingJson = await ratingRes.json();
      if (ratingJson.status === "OK") {
        contestCount = ratingJson.result.length;
      }
    }

    const result = {
      handle: username,
      rating: info?.rating || 0,
      maxRating: info?.maxRating || 0,
      rank: info?.rank || "unrated",
      maxRank: info?.maxRank || "unrated",
      solvedCount,
      contestCount,
      avatar: info?.avatar || "",
      calendar: calendarMap,
    };

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error in Codeforces proxy:", error);
    return NextResponse.json(
      { error: "Failed to fetch Codeforces data" },
      { status: 500 }
    );
  }
}
