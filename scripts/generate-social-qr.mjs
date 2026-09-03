import QRCode from 'qrcode';
import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'brand');
mkdirSync(outDir, { recursive: true });

const size = 512;
const badgeSize = 176;

async function makeQr(url, badgeSvg, fileName) {
	const qrBuf = await QRCode.toBuffer(url, {
		errorCorrectionLevel: 'H',
		type: 'png',
		width: size,
		margin: 2,
		color: { dark: '#111111', light: '#FFFFFF' },
	});

	const badge = await sharp(Buffer.from(badgeSvg)).resize(badgeSize, badgeSize).png().toBuffer();

	const out = await sharp(qrBuf)
		.composite([{ input: badge, gravity: 'centre' }])
		.png()
		.toBuffer();

	const outPath = join(outDir, fileName);
	writeFileSync(outPath, out);
	console.log('wrote', outPath, out.length);
}

/** 官方風格：漸層圓底＋白相機（Instagram Glyph） */
const igBadge = `<svg xmlns="http://www.w3.org/2000/svg" width="176" height="176" viewBox="0 0 176 176">
  <defs>
    <linearGradient id="igGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#feda75"/>
      <stop offset="22%" stop-color="#fa7e1e"/>
      <stop offset="50%" stop-color="#d62976"/>
      <stop offset="75%" stop-color="#962fbf"/>
      <stop offset="100%" stop-color="#4f5bd5"/>
    </linearGradient>
  </defs>
  <circle cx="88" cy="88" r="88" fill="#ffffff"/>
  <circle cx="88" cy="88" r="80" fill="url(#igGrad)"/>
  <g fill="#ffffff" transform="translate(88 88) scale(5.2) translate(-12 -12)">
    <path d="M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2Zm0 7.7a2.9 2.9 0 1 1 0-5.8 2.9 2.9 0 0 1 0 5.8Zm6.1-8.95a1.12 1.12 0 1 1-2.24 0 1.12 1.12 0 0 1 2.24 0ZM21.5 8.05c-.05-1.1-.23-1.86-.49-2.52a5.1 5.1 0 0 0-1.2-1.84 5.1 5.1 0 0 0-1.84-1.2c-.66-.26-1.42-.44-2.52-.49C14.35 1.95 14 1.93 12 1.93s-2.35.02-3.45.07c-1.1.05-1.86.23-2.52.49a5.1 5.1 0 0 0-1.84 1.2 5.1 5.1 0 0 0-1.2 1.84c-.26.66-.44 1.42-.49 2.52C2.45 9.15 2.43 9.5 2.43 11.5s.02 2.35.07 3.45c.05 1.1.23 1.86.49 2.52a5.1 5.1 0 0 0 1.2 1.84 5.1 5.1 0 0 0 1.84 1.2c.66.26 1.42.44 2.52.49 1.1.05 1.45.07 3.45.07s2.35-.02 3.45-.07c1.1-.05 1.86-.23 2.52-.49a5.1 5.1 0 0 0 1.84-1.2 5.1 5.1 0 0 0 1.2-1.84c.26-.66.44-1.42.49-2.52.05-1.1.07-1.45.07-3.45s-.02-2.35-.07-3.45ZM19.6 15.3a3.5 3.5 0 0 1-.67 1.84 3.3 3.3 0 0 1-1.2 1.2c-.5.27-1.1.45-1.84.5-1.08.05-1.4.06-3.89.06s-2.81-.01-3.89-.06a3.5 3.5 0 0 1-1.84-.5 3.3 3.3 0 0 1-1.2-1.2 3.5 3.5 0 0 1-.5-1.84c-.05-1.08-.06-1.4-.06-3.89s.01-2.81.06-3.89c.05-.74.23-1.34.5-1.84a3.3 3.3 0 0 1 1.2-1.2c.5-.27 1.1-.45 1.84-.5C9.19 3.94 9.51 3.93 12 3.93s2.81.01 3.89.06c.74.05 1.34.23 1.84.5a3.3 3.3 0 0 1 1.2 1.2c.27.5.45 1.1.5 1.84.05 1.08.06 1.4.06 3.89s-.01 2.81-.06 3.89Z"/>
  </g>
</svg>`;

/** Threads 維持黑圓白圖示 */
const threadsBadge = `<svg xmlns="http://www.w3.org/2000/svg" width="176" height="176" viewBox="0 0 176 176">
  <circle cx="88" cy="88" r="88" fill="#111111"/>
  <g fill="#ffffff" transform="translate(88 88) scale(5.2) translate(-12 -12)">
    <path d="M16.5 10.1c-.1-2.4-1.5-4-3.9-4.2-1.7-.1-3.2.6-3.9 2l1.4.7c.4-.9 1.3-1.4 2.4-1.3 1.4.1 2.2 1 2.3 2.5-.9-.4-1.9-.5-2.9-.3-2.9.5-4.8 2.3-4.4 4.9.3 1.9 1.8 3.2 3.9 3.2 1.5 0 2.7-.6 3.5-1.8.5.8 1.1 1.4 1.7 1.8l1.2-1.2c-.6-.5-1.2-1.3-1.6-2.3.4-.9.6-2 .5-3ZM12.5 15.8c-1.2 0-2-.7-2.1-1.7-.2-1.3.9-2.3 2.8-2.5.6-.1 1.2 0 1.8.2-.2 2.2-1.2 4-2.5 4Z"/>
  </g>
</svg>`;

await makeQr('https://www.instagram.com/yogurtguide', igBadge, 'qr-instagram.png');
await makeQr('https://www.threads.com/@yogurtguide', threadsBadge, 'qr-threads.png');
