import type { Command } from 'commander';
import { logger } from '../utils/logger.js';

export function registerDevCommand(program: Command): void {
  program
    .command('dev')
    .description('Start a development server for previewing compositions')
    .argument('[entry]', 'Entry file path', './src/index.ts')
    .option('--port <number>', 'Port number', '3000')
    .action(async (entry: string, opts) => {
      logger.banner();
      logger.info(`Starting dev server for ${entry}`);

      try {
        const vite = await (Function('specifier', 'return import(specifier)')('vite') as Promise<{
          createServer: (config: Record<string, unknown>) => Promise<{ listen: (port: number) => Promise<{ config: { server: { port: number } } }>; printUrls: () => void }>;
        }>);

        const server = await vite.createServer({
          root: process.cwd(),
          server: {
            port: parseInt(opts.port, 10),
          },
        });

        await server.listen(parseInt(opts.port, 10));
        server.printUrls();
      } catch (err) {
        logger.error(`Dev server failed: ${err instanceof Error ? err.message : String(err)}`);
        process.exit(1);
      }
    });
}
