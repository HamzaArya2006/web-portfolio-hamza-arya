import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const assetsDir = path.resolve('src/assets/img/projects');

const remoteImages = [
  {
    id: 'ptn-energy-solutions-website',
    url: 'https://ptn.com.af/wp-content/uploads/2026/02/8000W-1024x1024.jpg',
    filename: 'ptn-energy-solutions-website.webp',
  },
  {
    id: 'nexus-coffee-shop-landing',
    url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1200&auto=format&fit=crop',
    filename: 'nexus-coffee-shop-landing.webp',
  },
  {
    id: 'appstore-discovery-platform',
    url: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1200&auto=format&fit=crop',
    filename: 'appstore-discovery-platform.webp',
  },
  {
    id: 'simple-weather-app',
    url: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?q=80&w=1200&auto=format&fit=crop',
    filename: 'simple-weather-app.webp',
  },
];

async function downloadAndConvert({ id, url, filename }) {
  const targetPath = path.join(assetsDir, filename);

  try {
    await fs.mkdir(assetsDir, { recursive: true });

    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`[localize-remote-images] Failed to fetch ${id} (${url}): ${response.status} ${response.statusText}`);
      return;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await sharp(buffer)
      .rotate()
      .webp({ quality: 82 })
      .toFile(targetPath);

    console.log(`[localize-remote-images] Wrote ${path.relative(process.cwd(), targetPath)}`);
  } catch (error) {
    console.warn(`[localize-remote-images] Error processing ${id} (${url}):`, error.message);
  }
}

async function main() {
  for (const entry of remoteImages) {
    await downloadAndConvert(entry);
  }
}

main().catch((error) => {
  console.error('[localize-remote-images] Fatal error:', error);
  process.exit(1);
});

