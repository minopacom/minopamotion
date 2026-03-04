---
sidebar_position: 1
---

# Rendering Overview

Minopamotion provides multiple rendering backends for producing final video files from your compositions.

## Rendering Options

| Method | Package | Environment | Best For |
|--------|---------|-------------|----------|
| Server-side | `@minopamotion/renderer` | Node.js | Production rendering, CI/CD |
| Client-side | `@minopamotion/webcodecs` | Browser | Quick exports, no server needed |
| CLI | `@minopamotion/cli` | Terminal | Automation, scripting |

## How Rendering Works

1. **Frame capture** — each frame is rendered as a React component and captured as an image
2. **Encoding** — frames are assembled into a video using FFmpeg (server-side) or WebCodecs (client-side)
3. **Output** — the final video file (MP4, WebM, etc.)

Because each frame is a pure function of the frame number, frames can be rendered independently and in parallel.

:::info Coming Soon
The rendering packages are currently in development. Check back for updates.
:::
