#!/usr/bin/env node

/**
 * PWA Icon Generator for Kira
 *
 * Generates PNG icons in all required sizes from the SVG source.
 * Run: node scripts/generate-pwa-icons.mjs
 *
 * Requires: sharp (install with npm install sharp --save-dev if not present)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ICONS_DIR = path.join(ROOT, 'public', 'icons');

// Icon sizes needed for PWA
const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

// Colors from brand config
const PRIMARY_COLOR = '#f43f5e';
const GRADIENT_END = '#e11d48';

/**
 * Generate a simple PNG icon using canvas-like approach
 * Since we can't rely on sharp being installed, we'll create placeholder files
 * and provide instructions for proper generation
 */
async function generatePlaceholderIcons() {
  console.log('Generating PWA icon placeholders...');
  console.log('');

  // Create a simple HTML file that can be used to generate icons
  const htmlGenerator = `<!DOCTYPE html>
<html>
<head>
  <title>Kira PWA Icon Generator</title>
  <style>
    body { font-family: system-ui; padding: 20px; background: #f5f5f5; }
    .icon-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
    .icon-container { background: white; padding: 20px; border-radius: 12px; text-align: center; }
    .icon { display: inline-block; }
    canvas { border-radius: 21%; }
    h1 { color: #f43f5e; }
    button {
      background: #f43f5e;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      margin: 10px 5px;
    }
    button:hover { background: #e11d48; }
    .instructions {
      background: #fffbeb;
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 20px;
      border-left: 4px solid #f43f5e;
    }
  </style>
</head>
<body>
  <h1>Kira PWA Icon Generator</h1>

  <div class="instructions">
    <p><strong>Instructions:</strong></p>
    <ol>
      <li>Open this file in a browser</li>
      <li>Click "Download All Icons" to get all sizes</li>
      <li>Place the downloaded PNGs in <code>public/icons/</code></li>
    </ol>
  </div>

  <button onclick="downloadAll()">Download All Icons</button>
  <button onclick="downloadMaskable()">Download Maskable Icons</button>

  <div class="icon-grid" id="icons"></div>

  <script>
    const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
    const container = document.getElementById('icons');

    function createIcon(size, maskable = false) {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, '#f43f5e');
      gradient.addColorStop(1, '#e11d48');

      if (maskable) {
        // Maskable: full background, smaller K
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);

        ctx.fillStyle = 'white';
        ctx.font = \`bold \${size * 0.47}px system-ui, -apple-system, sans-serif\`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('K', size / 2, size / 2 + size * 0.02);
      } else {
        // Regular: rounded corners
        const radius = size * 0.21;
        ctx.beginPath();
        ctx.moveTo(radius, 0);
        ctx.lineTo(size - radius, 0);
        ctx.quadraticCurveTo(size, 0, size, radius);
        ctx.lineTo(size, size - radius);
        ctx.quadraticCurveTo(size, size, size - radius, size);
        ctx.lineTo(radius, size);
        ctx.quadraticCurveTo(0, size, 0, size - radius);
        ctx.lineTo(0, radius);
        ctx.quadraticCurveTo(0, 0, radius, 0);
        ctx.closePath();

        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.fillStyle = 'white';
        ctx.font = \`bold \${size * 0.55}px system-ui, -apple-system, sans-serif\`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('K', size / 2, size / 2 + size * 0.05);
      }

      return canvas;
    }

    function downloadCanvas(canvas, filename) {
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }

    function downloadAll() {
      sizes.forEach(size => {
        const canvas = createIcon(size, false);
        downloadCanvas(canvas, \`icon-\${size}x\${size}.png\`);
      });
    }

    function downloadMaskable() {
      [192, 512].forEach(size => {
        const canvas = createIcon(size, true);
        downloadCanvas(canvas, \`icon-maskable-\${size}x\${size}.png\`);
      });
    }

    // Render preview
    sizes.forEach(size => {
      const div = document.createElement('div');
      div.className = 'icon-container';

      const canvas = createIcon(size);
      canvas.style.width = Math.min(size, 150) + 'px';
      canvas.style.height = Math.min(size, 150) + 'px';

      const label = document.createElement('p');
      label.textContent = \`\${size}x\${size}\`;

      div.appendChild(canvas);
      div.appendChild(label);
      container.appendChild(div);
    });
  </script>
</body>
</html>`;

  const generatorPath = path.join(ICONS_DIR, 'generate-icons.html');
  fs.writeFileSync(generatorPath, htmlGenerator);

  console.log('Created: public/icons/generate-icons.html');
  console.log('');
  console.log('To generate PNG icons:');
  console.log('1. Open public/icons/generate-icons.html in your browser');
  console.log('2. Click "Download All Icons" and "Download Maskable Icons"');
  console.log('3. Move the downloaded files to public/icons/');
  console.log('');
  console.log('Or install sharp and re-run this script:');
  console.log('  npm install sharp --save-dev');
  console.log('  node scripts/generate-pwa-icons.mjs');
}

async function generateWithSharp() {
  try {
    const sharp = (await import('sharp')).default;

    console.log('Generating PWA icons with sharp...');

    const svgPath = path.join(ICONS_DIR, 'icon.svg');
    const maskableSvgPath = path.join(ICONS_DIR, 'icon-maskable.svg');

    // Generate regular icons
    for (const size of SIZES) {
      const outputPath = path.join(ICONS_DIR, `icon-${size}x${size}.png`);
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      console.log(`Created: icon-${size}x${size}.png`);
    }

    // Generate maskable icons
    for (const size of [192, 512]) {
      const outputPath = path.join(ICONS_DIR, `icon-maskable-${size}x${size}.png`);
      await sharp(maskableSvgPath)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      console.log(`Created: icon-maskable-${size}x${size}.png`);
    }

    console.log('');
    console.log('All PWA icons generated successfully!');

  } catch (error) {
    if (error.code === 'ERR_MODULE_NOT_FOUND') {
      await generatePlaceholderIcons();
    } else {
      throw error;
    }
  }
}

// Run
generateWithSharp().catch(console.error);
