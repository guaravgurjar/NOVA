/**
 * convert-banners.mjs
 * -------------------
 * One-shot script: converts every PNG/JPG/JPEG in public/images/banners/
 * to WebP (quality 82, max width 1920px) using sharp.
 *
 * Usage:  node convert-banners.mjs
 *
 * After running:
 *  - WebP files are saved alongside the originals
 *  - Original files are NOT deleted (you can review then remove them)
 *  - A size summary is printed so you can see the savings
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BANNER_DIR = path.join(__dirname, 'public', 'images', 'banners');

// Convert every PNG / JPG / JPEG — skip files that are already .webp
const files = fs.readdirSync(BANNER_DIR).filter(f =>
  /\.(png|jpe?g)$/i.test(f)
);

if (files.length === 0) {
  console.log('No PNG/JPG files found in', BANNER_DIR);
  process.exit(0);
}

console.log(`\n🔄  Converting ${files.length} banner(s) → WebP …\n`);

let totalOriginal = 0;
let totalConverted = 0;

for (const file of files) {
  const inputPath  = path.join(BANNER_DIR, file);
  const outputName = file.replace(/\.[^.]+$/, '.webp');
  const outputPath = path.join(BANNER_DIR, outputName);

  const originalSize = fs.statSync(inputPath).size;
  totalOriginal += originalSize;

  await sharp(inputPath)
    .resize({ width: 1920, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(outputPath);

  const convertedSize = fs.statSync(outputPath).size;
  totalConverted += convertedSize;

  const saving = (((originalSize - convertedSize) / originalSize) * 100).toFixed(1);
  console.log(
    `  ✅  ${file.padEnd(20)}  ${(originalSize / 1024 / 1024).toFixed(2)} MB  →  ${(convertedSize / 1024 / 1024).toFixed(2)} MB  (${saving}% smaller)`
  );
}

console.log(`\n${'─'.repeat(64)}`);
console.log(`  Total saved: ${((totalOriginal - totalConverted) / 1024 / 1024).toFixed(2)} MB`);
console.log(`  Before: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB  →  After: ${(totalConverted / 1024 / 1024).toFixed(2)} MB`);
console.log(`\n✨  Done! Update your <img> src paths from .png/.jpg → .webp`);
console.log(`    Original files are kept — delete them once you've verified.\n`);
