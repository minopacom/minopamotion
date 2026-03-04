---
sidebar_position: 3
---

# Client-Side Rendering

The `@minopamotion/webcodecs` package renders videos directly in the browser using the WebCodecs API.

## Overview

Client-side rendering uses the browser's native WebCodecs API to encode video without a server. This is ideal for quick exports and applications where users generate videos on the fly.

## Requirements

- A browser that supports the [WebCodecs API](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API) (Chrome 94+, Edge 94+)
- HTTPS context (WebCodecs requires a secure context)

:::info Coming Soon
This package is currently in development. The API documented here represents the planned interface.
:::

## Planned API

```tsx
import { renderMediaInBrowser } from '@minopamotion/webcodecs';

const blob = await renderMediaInBrowser({
  component: MyVideo,
  durationInFrames: 90,
  fps: 30,
  width: 1920,
  height: 1080,
  codec: 'vp8',
});

// Download the video
const url = URL.createObjectURL(blob);
```
