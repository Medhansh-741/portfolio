import { NextResponse } from "next/server";

export const revalidate = 3600; // Cache on server for 1 hour

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") || "Medhansh-741";

  // Fetch full data (all years) to support client-side toggling and complete calendars
  const apiUrl = `https://github-contributions-api.jogruber.de/v4/${username}`;

  try {
    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 }, // Fetch-level caching
      headers: {
        "User-Agent": "Portfolio-App",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `GitHub Contributions API returned status: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error in GitHub contributions proxy:", error);
    return NextResponse.json(
      { error: "Failed to fetch contribution data" },
      { status: 500 }
    );
  }
}
