const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const W = 658, H = 2226, jacketH = 1334, fade = 70;

async function processImage(inputPath, slug) {
  if (!fs.existsSync(inputPath)) {
    console.error('File not found:', inputPath);
    process.exit(1);
  }

  const outDir = path.join(__dirname, '..', 'public', 'custom-made', 'models');
  const suitOut = path.join(outDir, `suit-${slug}.webp`);
  const jacketOut = path.join(outDir, `jacket-${slug}.webp`);

  const suitImg = sharp(inputPath)
    .resize(W, H, { fit: 'cover', position: 'top' })
    .ensureAlpha();

  await suitImg
    .clone()
    .webp({ quality: 90 })
    .toFile(suitOut);

  const raw = await suitImg.raw().toBuffer();
  const jacketBuf = Buffer.alloc(W * jacketH * 4);

  for (let y = 0; y < jacketH; y++) {
    const ramp = Math.max(0, Math.min(1, (jacketH - y) / fade));
    for (let x = 0; x < W; x++) {
      const idx = (y * W + x) * 4;
      jacketBuf[idx] = raw[idx];
      jacketBuf[idx + 1] = raw[idx + 1];
      jacketBuf[idx + 2] = raw[idx + 2];
      jacketBuf[idx + 3] = Math.round(raw[idx + 3] * ramp);
    }
  }

  await sharp(jacketBuf, { raw: { width: W, height: jacketH, channels: 4 } })
    .webp({ quality: 90 })
    .toFile(jacketOut);

  console.log(`Successfully processed ${slug} -> ${suitOut} & ${jacketOut}`);
}

const [,, inputPath, slug] = process.argv;
if (!inputPath || !slug) {
  console.error('Usage: node process_model_image.js <inputPath> <slug>');
  process.exit(1);
}

processImage(inputPath, slug).catch((err) => {
  console.error(err);
  process.exit(1);
});
