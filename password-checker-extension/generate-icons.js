const fs = require('node:fs');
const zlib = require('node:zlib');

function chunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const payload = Buffer.concat([typeBuffer, data]);
  let crc = 0xffffffff;
  for (const byte of payload) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE((crc ^ 0xffffffff) >>> 0);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  return Buffer.concat([length, payload, crcBuffer]);
}

function createIcon(size) {
  const pixels = Buffer.alloc(size * (size * 4 + 1));
  const purple = [118, 85, 217, 255];
  const light = [255, 255, 255, 255];
  const inset = Math.max(1, Math.floor(size * 0.12));
  const lockLeft = Math.floor(size * 0.27);
  const lockRight = Math.ceil(size * 0.73);
  const shackleTop = Math.floor(size * 0.2);
  const shackleBottom = Math.floor(size * 0.56);
  const bodyTop = Math.floor(size * 0.43);
  const bodyBottom = Math.floor(size * 0.82);
  for (let y = 0; y < size; y += 1) {
    pixels[y * (size * 4 + 1)] = 0;
    for (let x = 0; x < size; x += 1) {
      const inside = x >= inset && x < size - inset && y >= inset && y < size - inset;
      const shackle = x >= lockLeft && x <= lockRight && y >= shackleTop && y < shackleBottom && (x <= lockLeft + Math.max(1, Math.floor(size * .1)) || x >= lockRight - Math.max(1, Math.floor(size * .1)) || y < shackleTop + Math.max(1, Math.floor(size * .1)));
      const body = x >= lockLeft - Math.max(1, Math.floor(size * .08)) && x <= lockRight + Math.max(1, Math.floor(size * .08)) && y >= bodyTop && y <= bodyBottom;
      const keyhole = x >= size * .47 && x <= size * .53 && y >= size * .54 && y <= size * .69;
      const pixel = inside ? (shackle || body ? purple : [245, 241, 255, 255]) : [0, 0, 0, 0];
      const offset = y * (size * 4 + 1) + 1 + x * 4;
      pixels.set(keyhole ? light : pixel, offset);
    }
  }
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0); header.writeUInt32BE(size, 4); header[8] = 8; header[9] = 6;
  const data = zlib.deflateSync(pixels);
  return Buffer.concat([signature, chunk('IHDR', header), chunk('IDAT', data), chunk('IEND', Buffer.alloc(0))]);
}

fs.mkdirSync('icons', { recursive: true });
for (const size of [16, 48, 128]) fs.writeFileSync(`icons/icon${size}.png`, createIcon(size));
console.log('Generated icon16.png, icon48.png, and icon128.png');
