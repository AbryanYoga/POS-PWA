const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Create directories
const iconsDir = path.join(__dirname, '../../public/icons');
fs.mkdirSync(iconsDir, { recursive: true });

// 1. Create SVG Icons
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2B5D4F"/>
      <stop offset="100%" stop-color="#1B3D34"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10B981"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="128" fill="url(#brandGrad)"/>
  <g transform="translate(106, 106)" fill="none" stroke="#FFFFFF" stroke-width="24" stroke-linecap="round" stroke-linejoin="round">
    <!-- POS Terminal / Register Screen -->
    <rect x="20" y="20" width="260" height="170" rx="18" fill="#1B3D34" stroke="#FFFFFF"/>
    <!-- Screen Header & Lines -->
    <line x1="50" y1="65" x2="140" y2="65" stroke="#10B981" stroke-width="18"/>
    <line x1="50" y1="105" x2="210" y2="105" stroke="#A7F3D0" stroke-width="12"/>
    <line x1="50" y1="140" x2="170" y2="140" stroke="#A7F3D0" stroke-width="12"/>
    <!-- Stand -->
    <path d="M110 190 L90 260 L210 260 L190 190" fill="#2B5D4F" stroke="#FFFFFF"/>
    <!-- Base -->
    <rect x="60" y="260" width="180" height="24" rx="12" fill="#FFFFFF" stroke="#FFFFFF"/>
  </g>
  <!-- Verified Badge -->
  <circle cx="370" cy="142" r="46" fill="url(#accentGrad)" stroke="#FFFFFF" stroke-width="8"/>
  <path d="M352 142 L364 154 L388 130" fill="none" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const svgMaskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="brandGradM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2B5D4F"/>
      <stop offset="100%" stop-color="#1B3D34"/>
    </linearGradient>
    <linearGradient id="accentGradM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10B981"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
  </defs>
  <!-- Full bleed for maskable -->
  <rect width="512" height="512" fill="url(#brandGradM)"/>
  <g transform="translate(116, 116) scale(0.9)" fill="none" stroke="#FFFFFF" stroke-width="24" stroke-linecap="round" stroke-linejoin="round">
    <rect x="20" y="20" width="260" height="170" rx="18" fill="#1B3D34" stroke="#FFFFFF"/>
    <line x1="50" y1="65" x2="140" y2="65" stroke="#10B981" stroke-width="18"/>
    <line x1="50" y1="105" x2="210" y2="105" stroke="#A7F3D0" stroke-width="12"/>
    <line x1="50" y1="140" x2="170" y2="140" stroke="#A7F3D0" stroke-width="12"/>
    <path d="M110 190 L90 260 L210 260 L190 190" fill="#2B5D4F" stroke="#FFFFFF"/>
    <rect x="60" y="260" width="180" height="24" rx="12" fill="#FFFFFF" stroke="#FFFFFF"/>
  </g>
  <circle cx="360" cy="150" r="40" fill="url(#accentGradM)" stroke="#FFFFFF" stroke-width="8"/>
  <path d="M344 150 L355 161 L376 140" fill="none" stroke="#FFFFFF" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

fs.writeFileSync(path.join(iconsDir, 'icon.svg'), svgIcon, 'utf8');
fs.writeFileSync(path.join(iconsDir, 'icon-maskable.svg'), svgMaskable, 'utf8');

// 2. Pure Node PNG Generator
function createPng(size, isMaskable) {
  // RGBA buffer
  const width = size;
  const height = size;
  const buffer = Buffer.alloc(width * height * 4);

  const brandR = 0x2B, brandG = 0x5D, brandB = 0x4F;
  const darkR = 0x1B, darkG = 0x3D, darkB = 0x34;
  const whiteR = 0xFF, whiteG = 0xFF, whiteB = 0xFF;
  const accentR = 0x10, accentG = 0xB9, accentB = 0x81;

  const cornerRadius = isMaskable ? 0 : size * 0.22;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      // Rounded rect mask for standard icon
      if (!isMaskable) {
        const dx = Math.max(0, Math.max(cornerRadius - x, x - (width - cornerRadius)));
        const dy = Math.max(0, Math.max(cornerRadius - y, y - (height - cornerRadius)));
        if (dx * dx + dy * dy > cornerRadius * cornerRadius) {
          buffer[idx] = 0;
          buffer[idx + 1] = 0;
          buffer[idx + 2] = 0;
          buffer[idx + 3] = 0; // Transparent
          continue;
        }
      }

      // Gradient background
      const ratio = (x + y) / (width + height);
      const r = Math.round(brandR * (1 - ratio) + darkR * ratio);
      const g = Math.round(brandG * (1 - ratio) + darkG * ratio);
      const b = Math.round(brandB * (1 - ratio) + darkB * ratio);

      buffer[idx] = r;
      buffer[idx + 1] = g;
      buffer[idx + 2] = b;
      buffer[idx + 3] = 255;

      // Normalize coords to 0..1
      const nx = x / width;
      const ny = y / height;

      // Draw screen rectangle: nx in [0.25, 0.75], ny in [0.25, 0.58]
      if (nx >= 0.26 && nx <= 0.74 && ny >= 0.26 && ny <= 0.58) {
        // Border
        const isBorder = (nx <= 0.28 || nx >= 0.72 || ny <= 0.28 || ny >= 0.56);
        if (isBorder) {
          buffer[idx] = whiteR; buffer[idx + 1] = whiteG; buffer[idx + 2] = whiteB;
        } else {
          buffer[idx] = 0x16; buffer[idx + 1] = 0x2E; buffer[idx + 2] = 0x27;
          // Inner decorative bar
          if (nx >= 0.32 && nx <= 0.52 && ny >= 0.33 && ny <= 0.37) {
            buffer[idx] = accentR; buffer[idx + 1] = accentG; buffer[idx + 2] = accentB;
          } else if (nx >= 0.32 && nx <= 0.65 && ny >= 0.41 && ny <= 0.44) {
            buffer[idx] = 0xA7; buffer[idx + 1] = 0xF3; buffer[idx + 2] = 0xD0;
          } else if (nx >= 0.32 && nx <= 0.58 && ny >= 0.48 && ny <= 0.51) {
            buffer[idx] = 0xA7; buffer[idx + 1] = 0xF3; buffer[idx + 2] = 0xD0;
          }
        }
      }

      // Draw stand: ny in [0.58, 0.72], nx in [0.42, 0.58]
      if (ny > 0.58 && ny <= 0.70) {
        const standWidthHalf = 0.04 + (ny - 0.58) * 0.4;
        if (Math.abs(nx - 0.5) <= standWidthHalf) {
          buffer[idx] = whiteR; buffer[idx + 1] = whiteG; buffer[idx + 2] = whiteB;
        }
      }

      // Draw base: ny in [0.70, 0.75], nx in [0.32, 0.68]
      if (ny >= 0.70 && ny <= 0.75 && nx >= 0.32 && nx <= 0.68) {
        buffer[idx] = whiteR; buffer[idx + 1] = whiteG; buffer[idx + 2] = whiteB;
      }

      // Green badge: center (0.72, 0.28), radius 0.09
      const bdx = nx - 0.72;
      const bdy = ny - 0.28;
      if (bdx * bdx + bdy * bdy <= 0.08 * 0.08) {
        if (bdx * bdx + bdy * bdy >= 0.068 * 0.068) {
          buffer[idx] = whiteR; buffer[idx + 1] = whiteG; buffer[idx + 2] = whiteB;
        } else {
          buffer[idx] = accentR; buffer[idx + 1] = accentG; buffer[idx + 2] = accentB;
        }
      }
    }
  }

  // Construct raw PNG
  const rawScanlines = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    rawScanlines[y * (1 + width * 4)] = 0; // Filter: None
    buffer.copy(rawScanlines, y * (1 + width * 4) + 1, y * width * 4, (y + 1) * width * 4);
  }

  const deflated = zlib.deflateSync(rawScanlines, { level: 9 });

  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (let j = 0; j < 8; j++) {
        c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
      }
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(12 + len);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);
    const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    buf.writeUInt32BE(crc32(typeAndData), 8 + len);
    return buf;
  }

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth
  ihdrData[9] = 6; // Color type (RGBA)
  ihdrData[10] = 0; // Compression
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  const idatChunk = makeChunk('IDAT', deflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

fs.writeFileSync(path.join(iconsDir, 'icon-192x192.png'), createPng(192, false));
fs.writeFileSync(path.join(iconsDir, 'icon-512x512.png'), createPng(512, false));
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-192x192.png'), createPng(192, true));
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-512x512.png'), createPng(512, true));

console.log('✅ PWA Icons generated in public/icons/:');
console.log(' - icon-192x192.png');
console.log(' - icon-512x512.png');
console.log(' - icon-maskable-192x192.png');
console.log(' - icon-maskable-512x512.png');
console.log(' - icon.svg');
console.log(' - icon-maskable.svg');
