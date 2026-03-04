---
sidebar_position: 1
---

# renderMediaInBrowser()

Renders a composition to a video file in the browser using the WebCodecs API.

```tsx
import { renderMediaInBrowser } from '@minopamotion/webcodecs';
```

:::info Coming Soon
This API is currently in development.
:::

## Planned Signature

```tsx
async function renderMediaInBrowser(options: {
  component: ComponentType;
  durationInFrames: number;
  fps: number;
  width: number;
  height: number;
  codec?: 'vp8' | 'vp9';
  inputProps?: Record<string, unknown>;
  onProgress?: (progress: number) => void;
}): Promise<Blob>;
```

Returns a `Blob` containing the encoded video.
