---
sidebar_position: 2
---

# Server-Side Rendering

The `@minopamotion/renderer` package renders videos on the server using Puppeteer for frame capture and FFmpeg for encoding.

## Overview

Server-side rendering is the most reliable method for producing high-quality video output. It captures each frame using a headless browser and encodes them into a video file.

## Pipeline

1. **Bundle** — your React code is bundled into a static site
2. **Serve** — the bundle is served locally
3. **Render frames** — Puppeteer opens each frame and takes a screenshot
4. **Stitch** — FFmpeg combines the frames into a video

:::info Coming Soon
This package is currently in development. The API documented here represents the planned interface.
:::

## Planned API

```tsx
import { renderMedia, bundle } from '@minopamotion/renderer';

const bundled = await bundle('./src/index.tsx');

await renderMedia({
  composition: 'my-video',
  serveUrl: bundled,
  outputLocation: 'out/video.mp4',
  codec: 'h264',
});
```
