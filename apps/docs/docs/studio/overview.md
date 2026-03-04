---
sidebar_position: 1
---

# Studio

The Minopamotion Studio is a visual editor for building and previewing videos.

:::info Coming Soon
The Studio is currently in development. This page describes the planned features.
:::

## Planned Features

- **Visual timeline** — drag and drop sequences on a timeline
- **Live preview** — see changes in real-time as you edit code
- **Inspector** — view and edit component props visually
- **Composition browser** — switch between compositions
- **Render dialog** — configure and start renders from the UI

## Architecture

The Studio will be built as a standalone React application that wraps your video project. It uses the same `@minopamotion/core` primitives as the Player and renderer, ensuring consistent behavior across all environments.
