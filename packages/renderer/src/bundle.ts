import path from 'node:path';
import fs from 'node:fs';
import type { BundleOptions } from './types.js';

/**
 * Bundles the user's entry file into a static HTML + JS bundle
 * that can be served and rendered by Puppeteer.
 *
 * Uses Vite (dynamically imported) to build the bundle.
 * Vite must be installed as a peer dependency by the consumer.
 */
export async function bundle(options: BundleOptions): Promise<string> {
  const { entry, outputDir } = options;
  const absoluteEntry = path.resolve(entry);

  if (!fs.existsSync(absoluteEntry)) {
    throw new Error(`Entry file not found: ${absoluteEntry}`);
  }

  let viteBuild: (config: Record<string, unknown>) => Promise<unknown>;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const vite = await (Function('specifier', 'return import(specifier)')('vite') as Promise<{
      build: (config: Record<string, unknown>) => Promise<unknown>;
    }>);
    viteBuild = vite.build;
  } catch {
    throw new Error(
      'Vite is required for bundling. Install it with: pnpm add vite',
    );
  }

  const htmlContent = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body>
<div id="root"></div>
<script type="module" src="${absoluteEntry}"></script>
</body>
</html>`;

  const htmlPath = path.join(outputDir, 'index.html');
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(htmlPath, htmlContent);

  await viteBuild({
    root: outputDir,
    build: {
      outDir: path.join(outputDir, 'dist'),
      rollupOptions: {
        input: htmlPath,
      },
    },
    logLevel: 'warn',
  });

  return path.join(outputDir, 'dist');
}
