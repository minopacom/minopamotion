export interface StudioServerOptions {
  entry: string;
  port?: number;
}

/**
 * Starts a Vite dev server with a virtual HTML entry that loads the studio UI.
 * Vite must be installed as a peer dependency.
 */
export async function startServer(options: StudioServerOptions): Promise<{
  close: () => Promise<void>;
  url: string;
}> {
  const { entry, port = 3333 } = options;

  const vite = await (Function('specifier', 'return import(specifier)')('vite') as Promise<{
    createServer: (config: Record<string, unknown>) => Promise<{
      listen: (port: number) => Promise<void>;
      close: () => Promise<void>;
    }>;
  }>);

  const server = await vite.createServer({
    root: process.cwd(),
    server: { port },
    plugins: [
      {
        name: 'minopamotion-studio',
        configureServer(server: { middlewares: { use: (fn: unknown) => void } }) {
          server.middlewares.use((req: { url?: string }, res: { setHeader: (k: string, v: string) => void; end: (s: string) => void }, next: () => void) => {
            if (req.url === '/studio') {
              res.setHeader('Content-Type', 'text/html');
              res.end(`<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><title>Minopamotion Studio</title></head>
<body>
<div id="studio-root"></div>
<script type="module" src="${entry}"></script>
</body>
</html>`);
              return;
            }
            next();
          });
        },
      },
    ],
  });

  await server.listen(port);
  const url = `http://localhost:${port}/studio`;

  return {
    close: () => server.close(),
    url,
  };
}
