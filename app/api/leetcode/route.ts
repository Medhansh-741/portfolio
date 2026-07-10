import { NextResponse } from "next/server";

export const revalidate = 3600; // Cache on server for 1 hour

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") || "iXfyEpMpyu";

  const query = `
    query userProblemsSolved($username: String!) {
      allQuestionsCount {
        difficulty
        count
      }
      matchedUser(username: $username) {
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
        calendar2026: userCalendar(year: 2026) {
          submissionCalendar
        }
        calendar2025: userCalendar(year: 2025) {
          submissionCalendar
        }
      }
      userContestRanking(username: $username) {
        rating
        topPercentage
      }
    }
  `;

  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Referer": "https://leetcode.com",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `LeetCode API returned status: ${response.status}` },
        { status: response.status }
      );
    }

    const json = await response.json();
    const calendarMap: Record<string, number> = {};

    // Parse LeetCode submission calendars
    if (json.data && json.data.matchedUser) {
      const { calendar2026, calendar2025 } = json.data.matchedUser;

      const parseCalendar = (cal: any) => {
        if (cal && cal.submissionCalendar) {
          try {
            const parsed = JSON.parse(cal.submissionCalendar);
            Object.entries(parsed).forEach(([timestampStr, count]) => {
              const timestamp = parseInt(timestampStr) * 1000;
              // Format to local date string in YYYY-MM-DD
              const date = new Date(timestamp);
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const day = String(date.getDate()).padStart(2, "0");
              const dateStr = `${year}-${month}-${day}`;
              calendarMap[dateStr] = (calendarMap[dateStr] || 0) + (count as number);
            });
          } catch (e) {
            console.error("Error parsing leetcode submission calendar string:", e);
          }
        }
      };

      parseCalendar(calendar2026);
      parseCalendar(calendar2025);
    }

    const payload = {
      data: json.data,
      calendar: calendarMap,
    };

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error in LeetCode proxy:", error);
    return NextResponse.json(
      { error: "Failed to fetch LeetCode data" },
      { status: 500 }
    );
  }
}
