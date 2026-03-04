---
sidebar_position: 4
---

# CLI

The `@minopamotion/cli` package provides a command-line interface for rendering videos.

:::info Coming Soon
This package is currently in development. The commands documented here represent the planned interface.
:::

## Planned Commands

### render

Render a composition to a video file:

```bash
npx minopamotion render src/index.tsx my-video --output out/video.mp4
```

#### Options

| Flag | Description |
|------|-------------|
| `--output`, `-o` | Output file path |
| `--codec` | Video codec (`h264`, `vp8`, `vp9`) |
| `--fps` | Override frames per second |
| `--width` | Override width |
| `--height` | Override height |

### dev

Start a development server with live preview:

```bash
npx minopamotion dev src/index.tsx
```

Opens a browser with the Studio interface for previewing and editing compositions.
