import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SRC_DIR = 'public/img/aircrafts';
const THUMB_WIDTH = 512;
const LARGE_WIDTH = 1280;

async function optimizeImage(filename) {
    const filePath = path.join(SRC_DIR, filename);
    const ext = path.extname(filename).toLowerCase();
    const name = path.basename(filename, ext);

    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') return;
    if (filename.includes('_thumb') || filename.includes('_large')) return;

    console.log(`Processing ${filename}...`);

    const image = sharp(filePath);
    
    // Flatten to remove potential alpha channel (user said no transparency needed)
    const base = image.clone().flatten({ background: { r: 255, g: 255, b: 255 } });

    // Generate Thumbnail WebP
    await base.clone()
        .resize({ width: THUMB_WIDTH, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(path.join(SRC_DIR, `${name}_thumb.webp`));

    // Generate Large WebP
    await base.clone()
        .resize({ width: LARGE_WIDTH, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(path.join(SRC_DIR, `${name}_large.webp`));

    // Optional: Generate Optimized JPEG versions if needed, 
    // but user asked for different sizes, WebP is best.
    
    console.log(`Done processing ${filename}`);
}

async function main() {
    const files = fs.readdirSync(SRC_DIR);
    for (const file of files) {
        if (fs.lstatSync(path.join(SRC_DIR, file)).isFile()) {
            await optimizeImage(file);
        }
    }
}

main().catch(console.error);
