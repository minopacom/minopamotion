import fs from 'node:fs';
import path from 'node:path';
import type { Browser } from 'puppeteer';
import type { RenderFramesOptions } from './types.js';

/**
 * Renders each frame of a composition to an image file using Puppeteer.
 *
 * For each frame:
 * 1. Navigates to `serveUrl?compositionId=X&frame=N`
 * 2. Waits for `window.remotion_renderReady === true`
 * 3. Takes a screenshot and saves to outputDir
 */
export async function renderFrames(
  browser: Browser,
  options: RenderFramesOptions,
): Promise<void> {
  const {
    serveUrl,
    compositionId,
    outputDir,
    imageFormat = 'png',
    durationInFrames,
    width = 1920,
    height = 1080,
    concurrency = 1,
    onFrameRendered,
  } = options;

  fs.mkdirSync(outputDir, { recursive: true });

  const frames = Array.from({ length: durationInFrames }, (_, i) => i);

  // Process frames with concurrency limit
  for (let i = 0; i < frames.length; i += concurrency) {
    const batch = frames.slice(i, i + concurrency);
    await Promise.all(
      batch.map(async (frame) => {
        const page = await browser.newPage();
        await page.setViewport({ width, height });

        const url = `${serveUrl}?compositionId=${compositionId}&frame=${frame}`;
        await page.goto(url, { waitUntil: 'networkidle0' });

        // Poll for render ready
        await page.waitForFunction(
          '(window as any).remotion_renderReady === true',
          { timeout: 30_000 },
        );

        const paddedFrame = String(frame).padStart(5, '0');
        const filePath = path.join(outputDir, `frame-${paddedFrame}.${imageFormat}`);

        await page.screenshot({
          path: filePath,
          type: imageFormat,
          fullPage: false,
        });

        await page.close();
        onFrameRendered?.(frame, durationInFrames);
      }),
    );
  }
}
