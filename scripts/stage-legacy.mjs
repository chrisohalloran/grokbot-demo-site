import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const note = '<!-- Generated from web/ by npm run build. Edit web/index.html, not this file. -->\n';

rmSync(resolve(root, 'assets'), { recursive: true, force: true });
mkdirSync(resolve(root, 'assets'), { recursive: true });
cpSync(resolve(dist, 'assets'), resolve(root, 'assets'), { recursive: true });

for (const file of ['index.html', '404.html', 'favicon.svg', '.nojekyll']) {
  const raw = readFileSync(resolve(dist, file));
  const body = file.endsWith('.html') ? Buffer.concat([Buffer.from(note), raw]) : raw;
  writeFileSync(resolve(root, file), body);
}
