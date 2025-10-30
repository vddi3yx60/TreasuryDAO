/* eslint-disable no-console */
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const projectRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const publicDir = path.resolve(projectRoot, 'public');
const svgPath = path.resolve(publicDir, 'favicon.svg');
const icoPath = path.resolve(publicDir, 'favicon.ico');

async function svgToPngBuffers(svgBuffer, sizes) {
  const outputs = [];
  for (const size of sizes) {
    const png = await sharp(svgBuffer, { density: 384 })
      .resize(size, size, { fit: 'contain' })
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toBuffer();
    outputs.push(png);
  }
  return outputs;
}

async function buildFavicon() {
  console.log('Reading SVG:', svgPath);
  const svg = await fs.readFile(svgPath);

  // Common ICO sizes; include 16-256 for broad compatibility
  const sizes = [16, 24, 32, 48, 64, 128, 256];
  console.log('Rendering PNGs at sizes:', sizes.join(', '));
  const pngBuffers = await svgToPngBuffers(svg, sizes);

  console.log('Packing ICO:', icoPath);
  const icoBuffer = await pngToIco(pngBuffers);
  await fs.writeFile(icoPath, icoBuffer);
  console.log('Done. Wrote', icoPath);
}

buildFavicon().catch((err) => {
  console.error('Favicon build failed:', err);
  process.exit(1);
});


