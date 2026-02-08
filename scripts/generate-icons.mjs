import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

const svgContent = readFileSync(join(publicDir, 'logo.svg'));

const sizes = [
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-16x16.png', size: 16 },
];

async function generateIcons() {
  for (const { name, size } of sizes) {
    await sharp(svgContent)
      .resize(size, size)
      .png()
      .toFile(join(publicDir, name));
    console.log(`Generated ${name}`);
  }

  // Generate ICO file (use 32x32 PNG as base)
  const ico32 = await sharp(svgContent)
    .resize(32, 32)
    .png()
    .toBuffer();

  // For favicon.ico, we'll just copy it to src/app as well
  await sharp(svgContent)
    .resize(32, 32)
    .png()
    .toFile(join(__dirname, '..', 'src', 'app', 'favicon.png'));

  console.log('All icons generated!');
}

generateIcons().catch(console.error);
