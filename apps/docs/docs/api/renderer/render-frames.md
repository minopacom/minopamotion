---
sidebar_position: 2
---

# renderFrames()

Renders individual frames of a composition as images.

```tsx
import { renderFrames } from '@minopamotion/renderer';
```

:::info Coming Soon
This API is currently in development.
:::

## Planned Signature

```tsx
async function renderFrames(options: {
  composition: string;
  serveUrl: string;
  outputDir: string;
  imageFormat?: 'png' | 'jpeg';
  inputProps?: Record<string, unknown>;
  onFrameRendered?: (frame: number) => void;
}): Promise<void>;
```
