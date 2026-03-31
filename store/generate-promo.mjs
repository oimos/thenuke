import { writeFileSync } from "fs";
import { deflateSync } from "zlib";

function createPromoPNG(width, height) {
  const rawData = [];

  for (let y = 0; y < height; y++) {
    rawData.push(0);
    for (let x = 0; x < width; x++) {
      const nx = x / width;
      const ny = y / height;

      // Dark gradient background
      const r = Math.round(15 + nx * 15 + ny * 10);
      const g = Math.round(23 + nx * 10 + ny * 15);
      const b = Math.round(42 + nx * 20 + ny * 20);

      // Central glow
      const cx = width / 2, cy = height / 2;
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      const maxDist = Math.sqrt(cx * cx + cy * cy);
      const glow = Math.max(0, 1 - dist / (maxDist * 0.6));
      const glowR = Math.min(255, r + Math.round(glow * 40));
      const glowG = Math.min(255, g + Math.round(glow * 30));
      const glowB = Math.min(255, b + Math.round(glow * 60));

      rawData.push(glowR, glowG, glowB, 255);
    }
  }

  return encodePNG(rawData, width, height);
}

function encodePNG(rawData, width, height) {
  const compressed = deflateSync(Buffer.from(rawData), { level: 6 });

  const chunks = [];

  // Signature
  chunks.push(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  chunks.push(makeChunk("IHDR", ihdr));

  // IDAT
  chunks.push(makeChunk("IDAT", compressed));

  // IEND
  chunks.push(makeChunk("IEND", Buffer.alloc(0)));

  return Buffer.concat(chunks);
}

function makeChunk(type, data) {
  const typeB = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);

  const crcData = Buffer.concat([typeB, data]);
  const crcVal = Buffer.alloc(4);
  crcVal.writeUInt32BE(crc32(crcData) >>> 0, 0);

  return Buffer.concat([len, typeB, data, crcVal]);
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Small promo tile: 440x280
const small = createPromoPNG(440, 280);
writeFileSync("store/promo-small.png", small);
console.log(`✓ promo-small.png (440x280, ${small.length} bytes)`);

// Marquee: 1400x560
const marquee = createPromoPNG(1400, 560);
writeFileSync("store/promo-marquee.png", marquee);
console.log(`✓ promo-marquee.png (1400x560, ${marquee.length} bytes)`);

console.log("\nPromo images generated. Add text/logo overlays with an image editor.");
console.log("Recommended overlay text: 'The Nuke — Emergency Privacy in <200ms'");
