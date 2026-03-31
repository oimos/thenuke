import { writeFileSync, mkdirSync } from "fs";
import { deflateSync } from "zlib";

function createPNG(size) {
  const channels = 4; // RGBA

  const rawData = [];
  for (let y = 0; y < size; y++) {
    rawData.push(0); // filter byte: None
    for (let x = 0; x < size; x++) {
      const cx = size / 2, cy = size / 2;
      const r = size * 0.42;
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);

      if (dist <= r) {
        // Blue circle background (#2563eb)
        const edgeDist = r - dist;
        const alpha = Math.min(edgeDist / 1.5, 1);

        // Draw a simple grid/chart icon inside
        const inset = size * 0.22;
        const innerSize = size - 2 * inset;
        const lx = x - inset, ly = y - inset;

        if (lx >= 0 && lx < innerSize && ly >= 0 && ly < innerSize) {
          // Grid lines
          const gridStep = innerSize / 4;
          const onGrid =
            Math.abs(lx % gridStep) < 1.2 ||
            Math.abs(ly % gridStep) < 1.2 ||
            lx < 1.2 || ly < 1.2 ||
            lx > innerSize - 1.2 || ly > innerSize - 1.2;

          if (onGrid) {
            // White grid lines
            rawData.push(255, 255, 255, Math.round(200 * alpha));
          } else {
            // Bars in the chart
            const col = Math.floor(lx / gridStep);
            const barHeights = [0.6, 0.85, 0.45, 0.7];
            const barH = barHeights[Math.min(col, 3)] * innerSize;
            const barTop = innerSize - barH;

            if (ly >= barTop && lx % gridStep > gridStep * 0.2 && lx % gridStep < gridStep * 0.8) {
              rawData.push(255, 255, 255, Math.round(230 * alpha));
            } else {
              rawData.push(37, 99, 235, Math.round(255 * alpha));
            }
          }
        } else {
          rawData.push(37, 99, 235, Math.round(255 * alpha));
        }
      } else {
        rawData.push(0, 0, 0, 0);
      }
    }
  }

  const compressed = deflateSync(Buffer.from(rawData));

  const png = Buffer.alloc(8 + 25 + (compressed.length + 12) + 12);
  let offset = 0;

  // PNG signature
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(png, offset);
  offset += 8;

  // IHDR chunk
  offset = writeChunk(png, offset, "IHDR", (buf) => {
    buf.writeUInt32BE(size, 0);
    buf.writeUInt32BE(size, 4);
    buf[8] = 8; // bit depth
    buf[9] = 6; // RGBA
    buf[10] = 0; // compression
    buf[11] = 0; // filter
    buf[12] = 0; // interlace
    return 13;
  });

  // IDAT chunk
  offset = writeChunk(png, offset, "IDAT", () => compressed.length, compressed);

  // IEND chunk
  offset = writeChunk(png, offset, "IEND", () => 0);

  return png.subarray(0, offset);
}

function writeChunk(buf, offset, type, sizeOrFn, data) {
  const typeBytes = Buffer.from(type, "ascii");
  let chunkData;

  if (data) {
    chunkData = data;
  } else {
    const size = sizeOrFn(Buffer.alloc(20));
    if (typeof size === "number") {
      chunkData = Buffer.alloc(size);
      sizeOrFn(chunkData);
    }
  }

  buf.writeUInt32BE(chunkData.length, offset);
  offset += 4;

  typeBytes.copy(buf, offset);
  offset += 4;

  if (chunkData.length > 0) {
    chunkData.copy(buf, offset);
  }
  offset += chunkData.length;

  const crcBuf = Buffer.alloc(4 + chunkData.length);
  typeBytes.copy(crcBuf, 0);
  chunkData.copy(crcBuf, 4);
  buf.writeUInt32BE(crc32(crcBuf) >>> 0, offset);
  offset += 4;

  return offset;
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

mkdirSync("public/icons", { recursive: true });

for (const size of [16, 48, 128]) {
  const png = createPNG(size);
  writeFileSync(`public/icons/icon${size}.png`, png);
  console.log(`Generated icon${size}.png (${png.length} bytes)`);
}
