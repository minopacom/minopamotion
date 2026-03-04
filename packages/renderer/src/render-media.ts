import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import puppeteer from 'puppeteer';
import type { RenderMediaOptions } from './types.js';
import { bundle } from './bundle.js';
import { serve } from './serve.js';
import { renderFrames } from './render-frames.js';
import { stitchFramesToVideo } from './stitch-frames-to-video.js';

/**
 * High-level orchestrator: bundle → serve → renderFrames → stitch → cleanup.
 */
export async function renderMedia(options: RenderMediaOptions): Promise<void> {
  const {
    entry,
    compositionId,
    outputLocation,
    codec = 'h264',
    imageFormat = 'png',
    fps = 30,
    width = 1920,
    height = 1080,
    durationInFrames = 300,
    concurrency = 1,
    onProgress,
  } = options;

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'minopamotion-'));
  const framesDir = path.join(tmpDir, 'frames');
  const bundleDir = path.join(tmpDir, 'bundle');

  try {
    // 1. Bundle
    const bundleOutput = await bundle({ entry, outputDir: bundleDir });

    // 2. Serve
    const { server, url } = await serve(bundleOutput);

    try {
      // 3. Launch browser and render frames
      const browser = await puppeteer.launch({ headless: true });

      try {
        await renderFrames(browser, {
          serveUrl: url,
          compositionId,
          outputDir: framesDir,
          imageFormat,
          fps,
          durationInFrames,
          width,
          height,
          concurrency,
          onFrameRendered: (frame, total) => {
            onProgress?.({
              renderedFrames: frame + 1,
              totalFrames: total,
              stitchProgress: 0,
            });
          },
        });
      } finally {
        await browser.close();
      }
    } finally {
      server.close();
    }

    // 4. Stitch frames into video
    await stitchFramesToVideo({
      framesDir,
      outputLocation,
      fps,
      codec,
      imageFormat,
    });

    onProgress?.({
      renderedFrames: durationInFrames,
      totalFrames: durationInFrames,
      stitchProgress: 1,
    });
  } finally {
    // 5. Cleanup tmp
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}
