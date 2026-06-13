import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourceDir = path.join(root, 'src', 'web');
const outputDir = path.join(root, 'dist');

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });
copyDirectory(sourceDir, outputDir);

console.log('Built static web app into dist/.');

function copyDirectory(from, to) {
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const source = path.join(from, entry.name);
    const target = path.join(to, entry.name);

    if (entry.isDirectory()) {
      fs.mkdirSync(target, { recursive: true });
      copyDirectory(source, target);
    } else {
      fs.copyFileSync(source, target);
    }
  }
}
