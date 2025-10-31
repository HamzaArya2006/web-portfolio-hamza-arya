import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const SRC_DIR = path.resolve('src/assets');
const OUT_DIR = path.resolve('public/images');
const RESPONSIVE_WIDTHS = [480, 768, 1024, 1440, 1920];
const RASTER_EXT = new Set(['.jpg', '.jpeg', '.png']);

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function* walk(dir) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else {
      yield full;
    }
  }
}

async function processImage(file) {
  const rel = path.relative(SRC_DIR, file);
  const ext = path.extname(file).toLowerCase();
  if (!RASTER_EXT.has(ext)) return; // skip svg/webp/avif and others

  const baseName = path.basename(file, ext);
  const outBaseDir = path.join(OUT_DIR, path.dirname(rel));
  await ensureDir(outBaseDir);

  const input = sharp(file).rotate();
  const meta = await input.metadata();
  const widths = RESPONSIVE_WIDTHS.filter((w) => !meta.width || w <= meta.width);
  widths.push(meta.width || widths[widths.length - 1]);

  // Generate WebP and AVIF variants
  for (const w of widths) {
    const outWebp = path.join(outBaseDir, `${baseName}-w${w}.webp`);
    const outAvif = path.join(outBaseDir, `${baseName}-w${w}.avif`);
    await sharp(file).resize({ width: w }).webp({ quality: 82 }).toFile(outWebp);
    await sharp(file).resize({ width: w }).avif({ quality: 55 }).toFile(outAvif);
  }

  // Also output an optimized original-format at max width
  const outOptim = path.join(outBaseDir, `${baseName}-optimized${ext}`);
  const pipeline = sharp(file).resize({
    width: Math.min(1920, meta.width || 1920),
    withoutEnlargement: true,
  });
  if (ext === '.png') {
    await pipeline.png({ compressionLevel: 9, palette: true }).toFile(outOptim);
  } else {
    await pipeline.jpeg({ quality: 82, mozjpeg: true }).toFile(outOptim);
  }
}

async function main() {
  await ensureDir(OUT_DIR);
  let count = 0;
  for await (const file of walk(SRC_DIR)) {
    try {
      await processImage(file);
      count++;
    } catch (err) {
      console.warn('Image optimization failed for', file, err.message);
    }
  }
  console.log(`Optimized ${count} images`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


