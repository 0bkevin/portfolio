// Renders scripts/og/default.html to public/assets/kevin-bravo-og.png (1200×630) with headless Chrome.
// Set CHROME_PATH if Chrome isn't at the default macOS location.
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";

const chrome = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const source = resolve("scripts/og/default.html");
const output = resolve("public/assets/kevin-bravo-og.png");
const scratch = mkdtempSync(join(tmpdir(), "og-"));
const raw = join(scratch, "og.png");

try {
	execFileSync(chrome, [
		"--headless=new",
		"--hide-scrollbars",
		"--force-device-scale-factor=1",
		"--window-size=1200,630",
		"--virtual-time-budget=3000",
		"--allow-file-access-from-files",
		`--user-data-dir=${join(scratch, "profile")}`,
		`--screenshot=${raw}`,
		pathToFileURL(source).href,
	], { stdio: "ignore" });

	const { width, height } = await sharp(raw).metadata();
	if (width !== 1200 || height !== 630) throw new Error(`Expected 1200×630, got ${width}×${height}`);

	await sharp(raw).png({ compressionLevel: 9, palette: true, quality: 100 }).toFile(output);
	console.log(`Wrote ${output}`);
} finally {
	rmSync(scratch, { recursive: true, force: true });
}
