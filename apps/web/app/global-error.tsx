"use client";

import "./globals.css";
import { ErrorContent } from "./error";

// Replaces the root layout when it fails, so it brings its own <html>/<body>.
export default function GlobalError(props: { error: Error & { digest?: string }; reset: () => void }) {
	return (
		<html lang="en">
			<body>
				<ErrorContent {...props} />
			</body>
		</html>
	);
}
