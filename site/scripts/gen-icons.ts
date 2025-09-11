import sharp from "sharp";
import { mkdir, readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const PUBLIC = resolve(ROOT, "public");
const ICONS = resolve(PUBLIC, "icons");
const CANDIDATES = [
  resolve(PUBLIC, "assets/logo/logo-proweb-icon.svg"),
  resolve(PUBLIC, "assets/logo/logo.svg"),
  resolve(PUBLIC, "logo.svg"),
];

function bg() { return { r: 10, g: 11, b: 20, alpha: 1 }; } // #0a0b14

async function pickSvg() {
  for (const p of CANDIDATES) {
    try { await readFile(p); return p; } catch {}
  }
  throw new Error("SVG logo not found under public/assets/logo");
}

async function main() {
  await mkdir(ICONS, { recursive: true });
  const svg = await pickSvg();

  // 192 + 512
  await sharp(svg).resize(192, 192).png().toFile(resolve(ICONS, "icon-192.png"));
  await sharp(svg).resize(512, 512).png().toFile(resolve(ICONS, "icon-512.png"));

  // maskable 512 with ~12% padding
  const size = 512, pad = Math.round(size * 0.12), inner = size - pad * 2;
  const logo = await sharp(svg).resize(inner, inner).png().toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: bg() } })
    .composite([{ input: logo, top: pad, left: pad }])
    .png()
    .toFile(resolve(ICONS, "icon-512-maskable.png"));

  // Favicons and apple-touch icon
  await sharp(svg).resize(16, 16).png().toFile(resolve(ICONS, "favicon-16.png"));
  await sharp(svg).resize(32, 32).png().toFile(resolve(ICONS, "favicon-32.png"));
  await sharp(svg).resize(180, 180).png().toFile(resolve(ICONS, "apple-touch-icon-180.png"));

  console.log("✔ Icons generated in /public/icons");
}

main().catch((e) => { console.error(e); process.exit(1); });
