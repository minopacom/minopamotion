---
sidebar_position: 1
---

# renderMedia()

Renders a composition to a video file.

```tsx
import { renderMedia } from '@minopamotion/renderer';
```

:::info Coming Soon
This API is currently in development.
:::

## Planned Signature

```tsx
async function renderMedia(options: {
  composition: string;
  serveUrl: string;
  outputLocation: string;
  codec?: 'h264' | 'vp8' | 'vp9';
  inputProps?: Record<string, unknown>;
  onProgress?: (progress: number) => void;
}): Promise<void>;
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `composition` | `string` | Composition ID to render |
| `serveUrl` | `string` | URL of the bundled site |
| `outputLocation` | `string` | Output file path |
| `codec` | `string` | Video codec |
| `inputProps` | `object` | Props for the composition |
| `onProgress` | `function` | Progress callback (0–1) |
