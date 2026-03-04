---
sidebar_position: 3
---

# stitchFramesToVideo()

Combines rendered frames into a video file using FFmpeg.

```tsx
import { stitchFramesToVideo } from '@minopamotion/renderer';
```

:::info Coming Soon
This API is currently in development.
:::

## Planned Signature

```tsx
async function stitchFramesToVideo(options: {
  framesDir: string;
  outputLocation: string;
  fps: number;
  codec?: 'h264' | 'vp8' | 'vp9';
  width: number;
  height: number;
}): Promise<void>;
```
