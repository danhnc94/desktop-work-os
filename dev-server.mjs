import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const requestedDir = process.argv[2] || path.join('src', 'web');
const publicDir = path.resolve(root, requestedDir);
const port = Number(process.env.PORT || 4173);

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://localhost:${port}`);
  const cleanPath = decodeURIComponent(url.pathname).replace(/^\/+/, '');
  const filePath = path.join(publicDir, cleanPath || 'index.html');
  const safePath = filePath.startsWith(publicDir) ? filePath : path.join(publicDir, 'index.html');
  const target = fs.existsSync(safePath) && fs.statSync(safePath).isDirectory()
    ? path.join(safePath, 'index.html')
    : safePath;

  if (!fs.existsSync(target)) {
    response.writeHead(404);
    response.end('Not found');
    return;
  }

  response.writeHead(200, { 'Content-Type': getContentType(target) });
  fs.createReadStream(target).pipe(response);
});

server.listen(port, () => {
  console.log(`Desktop Work OS is available at http://localhost:${port}`);
});

function getContentType(filePath) {
  const extension = path.extname(filePath);

  return {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml'
  }[extension] || 'application/octet-stream';
}
