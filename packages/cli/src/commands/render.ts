import type { Command } from 'commander';
import { renderMedia } from '@minopamotion/renderer';
import { logger } from '../utils/logger.js';

export function registerRenderCommand(program: Command): void {
  program
    .command('render')
    .description('Render a composition to a video file')
    .argument('<entry>', 'Entry file path')
    .argument('<compositionId>', 'Composition ID to render')
    .argument('<output>', 'Output file path')
    .option('--codec <codec>', 'Video codec (h264, h265, vp8, vp9)', 'h264')
    .option('--image-format <format>', 'Frame image format (png, jpeg)', 'png')
    .option('--concurrency <number>', 'Number of concurrent renders', '1')
    .option('--fps <number>', 'Frames per second', '30')
    .option('--width <number>', 'Video width', '1920')
    .option('--height <number>', 'Video height', '1080')
    .option('--duration <number>', 'Duration in frames', '300')
    .action(async (entry: string, compositionId: string, output: string, opts) => {
      logger.banner();
      logger.info(`Rendering ${compositionId} from ${entry}`);

      try {
        await renderMedia({
          entry,
          compositionId,
          outputLocation: output,
          codec: opts.codec,
          imageFormat: opts.imageFormat,
          concurrency: parseInt(opts.concurrency, 10),
          fps: parseInt(opts.fps, 10),
          width: parseInt(opts.width, 10),
          height: parseInt(opts.height, 10),
          durationInFrames: parseInt(opts.duration, 10),
          onProgress: (progress) => {
            const pct = Math.round(
              (progress.renderedFrames / progress.totalFrames) * 100,
            );
            process.stdout.write(`\r  Rendering: ${pct}% (${progress.renderedFrames}/${progress.totalFrames})`);
          },
        });

        console.log('');
        logger.success(`Rendered to ${output}`);
      } catch (err) {
        console.log('');
        logger.error(`Render failed: ${err instanceof Error ? err.message : String(err)}`);
        process.exit(1);
      }
    });
}
