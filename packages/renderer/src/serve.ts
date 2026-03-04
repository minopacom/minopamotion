import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

/**
 * Starts a simple static HTTP server for the bundled output.
 * Returns the server instance and the URL it's serving at.
 */
export async function serve(
  staticDir: string,
  port = 0,
): Promise<{ server: http.Server; url: string }> {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const urlPath = req.url === '/' ? '/index.html' : req.url ?? '/index.html';
      const filePath = path.join(staticDir, urlPath);

      if (!fs.existsSync(filePath)) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }

      const ext = path.extname(filePath);
      const contentType = MIME_TYPES[ext] ?? 'application/octet-stream';

      const content = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });

    server.listen(port, '127.0.0.1', () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        reject(new Error('Failed to get server address'));
        return;
      }
      resolve({
        server,
        url: `http://127.0.0.1:${address.port}`,
      });
    });

    server.on('error', reject);
  });
}
