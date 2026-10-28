import { mkdir, writeFile, rename, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { isIP } from 'node:net';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { createSnapshot } from './notion-core.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const token = process.env.NOTION_TOKEN;
if (!token) throw new Error('NOTION_TOKEN is missing. Configure it securely; do not paste it into code or chat.');
const pending = new Map();
async function request(path) {
  const response = await fetch(`https://api.notion.com/v1${path}`, { redirect: 'error', signal: AbortSignal.timeout(30000), headers: { Authorization: `Bearer ${token}`, 'Notion-Version': '2022-06-28' } });
  if (!response.ok) throw new Error(`Notion returned HTTP ${response.status}; check read access to the approved Canvas page. Snapshot unchanged.`);
  return response.json();
}
async function image(input) {
  let url = new URL(input);
  for (let attempt = 0; attempt < 5; attempt++) {
    const host = url.hostname;
    if (url.protocol !== 'https:' || url.username || url.password || isIP(host.replace(/[\[\]]/g, '')) || !host.includes('.') || host.endsWith('.local') || host.endsWith('.localhost')) throw new Error('Images must use a public HTTPS hostname');
    const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(30000) });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get('location');
      if (!location) throw new Error('Image redirect missing destination');
      url = new URL(location, url); continue;
    }
    if (!response.ok) throw new Error(`Image download failed: HTTP ${response.status}. Check the image hostname in environment network settings.`);
    const mime = response.headers.get('content-type')?.split(';')[0];
    const ext = ({ 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif', 'image/avif': 'avif' })[mime];
    if (!ext) throw new Error(`Unsupported image type: ${mime}. Export a supported raster image.`);
    const reader = response.body.getReader(); const chunks = []; let size = 0;
    while (true) {
      const { value, done } = await reader.read(); if (done) break;
      size += value.length;
      if (size > 20 * 1024 * 1024) { await reader.cancel(); throw new Error('Image exceeds 20 MB'); }
      chunks.push(value);
    }
    if (!size) throw new Error('Image is empty');
    const bytes = Buffer.concat(chunks), hash = createHash('sha256').update(bytes).digest('hex');
    const name = `${hash}.${ext}`;
    pending.set(name, bytes);
    return `/media/notion/canvas/${name}`;
  }
  throw new Error('Too many image redirects');
}
// Validate and download everything before modifying the reviewed snapshot.
const snapshot = await createSnapshot({ request, image });
const destination = resolve(root, 'content/canvas.notion.json');
await readFile(destination); // Refuse an unexpected checkout before writing.
const assets = resolve(root, 'public/media/notion/canvas');
await mkdir(assets, { recursive: true });
for (const [name, bytes] of pending) await writeFile(resolve(assets, name), bytes, { flag: 'wx' }).catch(error => { if (error.code !== 'EEXIST') throw error; });
const temporary = `${destination}.${process.pid}.tmp`;
await writeFile(temporary, JSON.stringify(snapshot, null, 2) + '\n');
await rename(temporary, destination);
console.log(`Canvas refreshed: ${snapshot.blocks.length} blocks, ${pending.size} images. Review the Git diff, build a preview, and approve before publishing. Nothing was committed or deployed.`);
