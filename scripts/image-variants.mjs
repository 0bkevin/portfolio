// Writes smaller copies of large AVIF images in public/assets (name-800w.avif, name-1600w.avif)
// so pages can offer them in a srcset (see src/lib/responsive-image.ts). Run `npm run images`
// after adding images; existing copies are kept.
import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

// Keep in sync with VARIANT_WIDTHS in src/lib/responsive-image.ts, which builds the srcset.
const VARIANT_WIDTHS = [800, 1600];
const ROOT = "public/assets";

function* avifFiles(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) yield* avifFiles(path);
    else if (path.endsWith(".avif") && !/-\d+w\.avif$/.test(path)) yield path;
  }
}

for (const file of avifFiles(ROOT)) {
  const { width } = await sharp(file).metadata();
  for (const target of VARIANT_WIDTHS) {
    // Only worth it when the original is meaningfully larger than the copy.
    if (!width || width < target * 1.2) continue;
    const out = file.replace(/\.avif$/, `-${target}w.avif`);
    if (existsSync(out)) continue;
    await sharp(file).resize({ width: target }).avif({ quality: 62, effort: 6 }).toFile(out);
    console.log(`${out} (${(statSync(out).size / 1024).toFixed(0)} KB, from ${(statSync(file).size / 1024).toFixed(0)} KB)`);
  }
}
