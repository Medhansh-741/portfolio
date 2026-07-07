import { NextResponse } from "next/server";

export const revalidate = 300; // Cache on server for 5 minutes

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") || "Medhansh-741";
  const atomUrl = `https://github.com/${username}.atom`;

  try {
    const response = await fetch(atomUrl, {
      next: { revalidate: 300 }, // Fetch-level caching
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `GitHub Atom feed returned status: ${response.status}` },
        { status: response.status }
      );
    }

    const xml = await response.text();
    const commitsList: Array<{ id: string; repo: string; message: string; date: string; link: string }> = [];

    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let match;

    // Decode basic HTML entities returned in XML content
    const decodeHtml = (str: string) => {
      return str
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&")
        .replace(/&#39;/g, "'");
    };

    while ((match = entryRegex.exec(xml)) !== null && commitsList.length < 12) {
      const entry = match[1];

      // Extract published date
      const dateMatch = /<published>([^<]+)<\/published>/.exec(entry);
      const date = dateMatch ? dateMatch[1] : new Date().toISOString();

      // Extract repository name
      const titleMatch = /<title type="html">[^ ]+ pushed ([^<]+)<\/title>/.exec(entry);
      let repoName = titleMatch ? titleMatch[1].trim() : "";

      // Ensure repo name format has user prefix
      if (repoName && !repoName.includes("/")) {
        repoName = `${username}/${repoName}`;
      }

      // Extract commits messages and URLs from <content type="html">
      const contentMatch = /<content type="html">([\s\S]*?)<\/content>/.exec(entry);
      if (contentMatch) {
        const htmlContent = contentMatch[1];
        const decodedHtml = decodeHtml(htmlContent);

        // Find all <li> elements representing commit items
        const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/g;
        let liMatch;
        let entryCommitsCount = 0;

        while ((liMatch = liRegex.exec(decodedHtml)) !== null && commitsList.length < 12) {
          const liContent = liMatch[1];

          // Extract commit message from blockquote
          const msgMatch = /<blockquote>([\s\S]*?)<\/blockquote>/.exec(liContent);
          let msg = msgMatch ? msgMatch[1].trim() : "";
          msg = msg.replace(/\s+/g, " "); // clean up layout spacing

          if (msg) {
            // Extract commit relative URL (containing '/commit/')
            const commitLinkMatch = /href="([^"]*\/commit\/[^"]*)"/.exec(liContent);
            const relativeLink = commitLinkMatch ? commitLinkMatch[1] : "";
            const absoluteLink = relativeLink
              ? `https://github.com${relativeLink}`
              : `https://github.com/${repoName}`;

            commitsList.push({
              id: `${date}-${entryCommitsCount}-${Math.random().toString(36).substring(2, 7)}`,
              repo: repoName || "GitHub Repository",
              message: msg,
              date: date,
              link: absoluteLink,
            });
            entryCommitsCount++;
          }
        }
      }
    }

    return NextResponse.json(commitsList, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Error in GitHub activity RSS proxy:", error);
    return NextResponse.json(
      { error: "Failed to fetch commit activity" },
      { status: 500 }
    );
  }
}
