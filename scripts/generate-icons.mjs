import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const svgPath = path.join(root, 'web', 'icons', 'icon.svg');
const svg = await fs.readFile(svgPath);

await fs.mkdir(path.join(root, 'build'), { recursive: true });
await sharp(svg).resize(512, 512).png().toFile(path.join(root, 'build', 'icon.png'));
console.log('✓ build/icon.png');

async function exists(target) {
  try { await fs.access(target); return true; } catch { return false; }
}

const resDir = path.join(root, 'android', 'app', 'src', 'main', 'res');
if (await exists(resDir)) {
  const densities = {
    mdpi: { icon: 48, fg: 108 },
    hdpi: { icon: 72, fg: 162 },
    xhdpi: { icon: 96, fg: 216 },
    xxhdpi: { icon: 144, fg: 324 },
    xxxhdpi: { icon: 192, fg: 432 }
  };

  for (const [density, sizes] of Object.entries(densities)) {
    const dir = path.join(resDir, 'mipmap-' + density);
    if (!(await exists(dir))) continue;

    await sharp(svg).resize(sizes.icon, sizes.icon).png().toFile(path.join(dir, 'ic_launcher.png'));
    await sharp(svg).resize(sizes.icon, sizes.icon).png().toFile(path.join(dir, 'ic_launcher_round.png'));
    await sharp(svg).resize(sizes.fg, sizes.fg).png().toFile(path.join(dir, 'ic_launcher_foreground.png'));
  }
  console.log('✓ android launcher icons');

  const valuesDir = path.join(resDir, 'values');
  if (await exists(valuesDir)) {
    await fs.writeFile(
      path.join(valuesDir, 'ic_launcher_background.xml'),
      '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#08080A</color>\n</resources>\n'
    );
    console.log('✓ android adaptive icon background');
  }
} else {
  console.log('· android/ not found, skipped launcher icons');
}
