import { NextResponse } from "next/server";

const HOST = "medhanshk.me";
const KEY = "4acab0b6b1664896bf7d6705e9b0908f";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const URL_LIST = [
	`https://${HOST}/`,
	`https://${HOST}/about`,
	`https://${HOST}/projects`,
	`https://${HOST}/experience`,
	`https://${HOST}/projects/jansamadhan`,
	`https://${HOST}/projects/nyayaai`,
	`https://${HOST}/llms.txt`,
	`https://${HOST}/sitemap.xml`,
];

export async function GET() {
	const payload = {
		host: HOST,
		key: KEY,
		keyLocation: KEY_LOCATION,
		urlList: URL_LIST,
	};

	try {
		const response = await fetch("https://api.indexnow.org/IndexNow", {
			method: "POST",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
			},
			body: JSON.stringify(payload),
		});

		return NextResponse.json({
			success: response.ok || response.status === 202,
			status: response.status,
			submittedUrls: URL_LIST.length,
			timestamp: new Date().toISOString(),
		});
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json(
			{
				success: false,
				error: message,
			},
			{ status: 500 }
		);
	}
}
