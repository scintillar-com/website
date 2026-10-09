// Builds public/brand/scintillar-brand-kit.zip from public/brand/kit and public/brand/tokens.
// Run with `pnpm brand-kit` after changing any file in those folders. Uses only Node built-ins.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { crc32, deflateRawSync } from "node:zlib";

const root = join(import.meta.dirname, "..", "public", "brand");
const out = join(root, "scintillar-brand-kit.zip");

const readme = `Scintillar brand kit
====================

logos/   The logo in three layouts: horizontal (default), vertical and mark.
icons/   The mark on a tile, for favicons and app icons.
tokens/  Colors and type as CSS variables and W3C design tokens.

Each file comes as SVG and as PNG at 1x, 2x and 4x.
"on-light" files have dark ink, for light backgrounds.
"on-dark" files have light ink, for dark backgrounds.
"brand" is green; "mono" is a single neutral color, for photos and colored backgrounds.

Use the files as they are: don't redraw, retype, recolor, stretch, rotate or add effects.
Scintillar tools are white-label: you never have to show this logo in a tool you host.

Full guide: https://scintillar.com/en/brand
`;

const entries = [
  { name: "README.txt", data: Buffer.from(readme) },
  ...readdirSync(join(root, "kit"))
    .sort()
    .map((file) => ({
      name: `${file.startsWith("scintillar-icon-") ? "icons" : "logos"}/${file}`,
      data: readFileSync(join(root, "kit", file)),
    })),
  ...readdirSync(join(root, "tokens"))
    .sort()
    .map((file) => ({ name: `tokens/${file}`, data: readFileSync(join(root, "tokens", file)) })),
];

// Fixed timestamp (2026-01-01) so the zip only changes when its contents do.
const DOS_TIME = 0;
const DOS_DATE = ((2026 - 1980) << 9) | (1 << 5) | 1;

const local = [];
const central = [];
let offset = 0;
for (const { name, data } of entries) {
  const nameBuf = Buffer.from(name);
  const packed = deflateRawSync(data, { level: 9 });
  const crc = crc32(data);

  const header = Buffer.alloc(30);
  header.writeUInt32LE(0x04034b50, 0);
  header.writeUInt16LE(20, 4);
  header.writeUInt16LE(0x0800, 6); // UTF-8 names
  header.writeUInt16LE(8, 8); // deflate
  header.writeUInt16LE(DOS_TIME, 10);
  header.writeUInt16LE(DOS_DATE, 12);
  header.writeUInt32LE(crc, 14);
  header.writeUInt32LE(packed.length, 18);
  header.writeUInt32LE(data.length, 22);
  header.writeUInt16LE(nameBuf.length, 26);
  local.push(header, nameBuf, packed);

  const entry = Buffer.alloc(46);
  entry.writeUInt32LE(0x02014b50, 0);
  entry.writeUInt16LE(20, 4);
  entry.writeUInt16LE(20, 6);
  entry.writeUInt16LE(0x0800, 8);
  entry.writeUInt16LE(8, 10);
  entry.writeUInt16LE(DOS_TIME, 12);
  entry.writeUInt16LE(DOS_DATE, 14);
  entry.writeUInt32LE(crc, 16);
  entry.writeUInt32LE(packed.length, 20);
  entry.writeUInt32LE(data.length, 24);
  entry.writeUInt16LE(nameBuf.length, 28);
  entry.writeUInt32LE(offset, 42);
  central.push(entry, nameBuf);

  offset += header.length + nameBuf.length + packed.length;
}

const centralBuf = Buffer.concat(central);
const end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0);
end.writeUInt16LE(entries.length, 8);
end.writeUInt16LE(entries.length, 10);
end.writeUInt32LE(centralBuf.length, 12);
end.writeUInt32LE(offset, 16);

writeFileSync(out, Buffer.concat([...local, centralBuf, end]));
console.log(`Wrote ${entries.length} files to public/brand/scintillar-brand-kit.zip`);
