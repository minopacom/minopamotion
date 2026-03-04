---
sidebar_position: 1
---

# render

Renders a composition to a video file.

:::info Coming Soon
This command is currently in development.
:::

## Planned Usage

```bash
npx minopamotion render <entry-point> <composition-id> [options]
```

## Options

| Flag | Description |
|------|-------------|
| `--output`, `-o` | Output file path |
| `--codec` | Video codec (`h264`, `vp8`, `vp9`) |
| `--fps` | Override frames per second |
| `--width` | Override width |
| `--height` | Override height |
| `--props` | JSON string of input props |

## Example

```bash
npx minopamotion render src/index.tsx my-video -o out/video.mp4 --codec h264
```
