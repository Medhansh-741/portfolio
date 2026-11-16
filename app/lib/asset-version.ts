// Scripts in /public are served under fixed names and cached by browsers for hours, so a deploy could
// pair new HTML with an old cached script. Versioning the URL per deploy prevents that (CSS is inlined).
const VERSION = (process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.VERCEL_DEPLOYMENT_ID ?? String(Date.now())).slice(0, 12);

/** "/new-portfolio/portfolio.js" -> "/new-portfolio/portfolio.js?v=<deploy>" */
export function versioned(path: string) {
	return `${path}?v=${VERSION}`;
}
