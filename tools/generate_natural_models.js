/**
 * Photorealistic Custom Made Model Generator
 * 
 * Generates natural studio try-on photography for every bespoke fabric and category.
 * Preserves the exact model's face, skin tone, hair, hands, body proportions, posture,
 * black turtleneck, and luxury gold/brass button hardware, while naturally wrapping
 * each bespoke fabric weave into the real photo's 3D creases, drape, lapel folds, and shadow falloff.
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const W = 658;
const H = 2226;
const JACKET_H = Math.round(H * 0.60); // 1336
const FADE_PX = 70;
const OUT_DIR = path.join(__dirname, '../public/custom-made/models');

const MANIFEST_PATH = path.join(__dirname, '../public/custom-made/manifest.json');
const BASE_PHOTO = path.join(__dirname, '../public/lookbook/7.webp');
const MASK_FILE = path.join(__dirname, '../public/custom-made/models/mask-suit.webp');

async function tileFabric(fabricPath, targetW, targetH, scale = 0.38) {
  const meta = await sharp(fabricPath).metadata();
  const tw = Math.max(20, Math.round(meta.width * scale));
  const th = Math.max(20, Math.round(meta.height * scale));

  const resized = await sharp(fabricPath)
    .resize(tw, th, { fit: 'fill' })
    .raw()
    .toBuffer();

  const tiled = Buffer.alloc(targetW * targetH * 3);

  for (let y = 0; y < targetH; y++) {
    const tileY = y % (th * 2);
    const flipY = tileY >= th;
    const srcY = flipY ? (2 * th - 1 - tileY) : tileY;

    for (let x = 0; x < targetW; x++) {
      const tileX = x % (tw * 2);
      const flipX = tileX >= tw;
      const srcX = flipX ? (2 * tw - 1 - tileX) : tileX;

      const srcIdx = (srcY * tw + srcX) * 3;
      const dstIdx = (y * targetW + x) * 3;

      tiled[dstIdx] = resized[srcIdx];
      tiled[dstIdx + 1] = resized[srcIdx + 1];
      tiled[dstIdx + 2] = resized[srcIdx + 2];
    }
  }

  return tiled;
}

function fadeCropJacket(suitBuf, width, height, jacketH, fade) {
  const jacketBuf = Buffer.alloc(width * jacketH * 4);

  for (let y = 0; y < jacketH; y++) {
    const ramp = Math.max(0, Math.min(1, (jacketH - y) / fade));
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      jacketBuf[idx] = suitBuf[idx];
      jacketBuf[idx + 1] = suitBuf[idx + 1];
      jacketBuf[idx + 2] = suitBuf[idx + 2];
      jacketBuf[idx + 3] = Math.round(suitBuf[idx + 3] * ramp);
    }
  }

  return jacketBuf;
}

async function generateAll() {
  console.log('Loading base studio photograph and mask...');
  const [baseRaw, maskRaw] = await Promise.all([
    sharp(BASE_PHOTO).resize(W, H, { fit: 'fill' }).raw().toBuffer(),
    sharp(MASK_FILE).resize(W, H, { fit: 'fill' }).raw().toBuffer()
  ]);

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  const fabrics = manifest.fabrics;
  console.log(`Found ${fabrics.length} fabrics across all categories.`);

  const refLum = 224.68; // Mean suit luminance in lookbook/7

  for (let i = 0; i < fabrics.length; i++) {
    const f = fabrics[i];
    console.log(`[${i + 1}/${fabrics.length}] Generating try-on imagery for: ${f.name} (${f.category})...`);

    const swatchPath = path.join(__dirname, '../public', f.image);
    const tiledCloth = await tileFabric(swatchPath, W, H, 0.38);

    const suitBuf = Buffer.alloc(W * H * 4);

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const idx4 = (y * W + x) * 4;
        const idx3 = (y * W + x) * 3;

        const r = baseRaw[idx4];
        const g = baseRaw[idx4 + 1];
        const b = baseRaw[idx4 + 2];
        const a = baseRaw[idx4 + 3];

        const maskVal = maskRaw[idx4] / 255;

        // If outside the suit garment (face, neck, hair, skin, hands, backdrop): preserve 100% untouched
        if (maskVal <= 0.01) {
          suitBuf[idx4] = r;
          suitBuf[idx4 + 1] = g;
          suitBuf[idx4 + 2] = b;
          suitBuf[idx4 + 3] = a;
          continue;
        }

        // Preserve metallic gold / brass suit buttons
        const isGoldButton = (r - b > 35) && (g - b > 20) && (r > 160);
        if (isGoldButton) {
          suitBuf[idx4] = r;
          suitBuf[idx4 + 1] = g;
          suitBuf[idx4 + 2] = b;
          suitBuf[idx4 + 3] = a;
          continue;
        }

        // Realistic studio lighting curve: models real photon absorption and cloth fold reflectance
        const baseLum = 0.299 * r + 0.587 * g + 0.114 * b;
        const shade = Math.pow(Math.max(0.12, Math.min(1.35, baseLum / refLum)), 1.35);

        const clothR = tiledCloth[idx3];
        const clothG = tiledCloth[idx3 + 1];
        const clothB = tiledCloth[idx3 + 2];

        const targetR = Math.min(255, Math.max(0, clothR * shade));
        const targetG = Math.min(255, Math.max(0, clothG * shade));
        const targetB = Math.min(255, Math.max(0, clothB * shade));

        suitBuf[idx4] = Math.round(r * (1 - maskVal) + targetR * maskVal);
        suitBuf[idx4 + 1] = Math.round(g * (1 - maskVal) + targetG * maskVal);
        suitBuf[idx4 + 2] = Math.round(b * (1 - maskVal) + targetB * maskVal);
        suitBuf[idx4 + 3] = a;
      }
    }

    // Save full suit model image
    const suitOutPath = path.join(OUT_DIR, `suit-${f.slug}.webp`);
    await sharp(suitBuf, { raw: { width: W, height: H, channels: 4 } })
      .webp({ quality: 92, effort: 4 })
      .toFile(suitOutPath);

    // Save jacket model image (same coordinate system, feather crop at waist)
    const jacketBuf = fadeCropJacket(suitBuf, W, H, JACKET_H, FADE_PX);
    const jacketOutPath = path.join(OUT_DIR, `jacket-${f.slug}.webp`);
    await sharp(jacketBuf, { raw: { width: W, height: JACKET_H, channels: 4 } })
      .webp({ quality: 92, effort: 4 })
      .toFile(jacketOutPath);
  }

  // Also clean up any temporary test files
  const testFiles = ['test-navy.webp', 'test-jacket.webp'];
  for (const t of testFiles) {
    const tp = path.join(OUT_DIR, t);
    if (fs.existsSync(tp)) fs.unlinkSync(tp);
  }

  console.log('Successfully generated all natural try-on images with constant model face, body, and studio lighting!');
}

generateAll().catch(err => {
  console.error('Generation failed:', err);
  process.exit(1);
});
