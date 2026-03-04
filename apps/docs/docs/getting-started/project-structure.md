---
sidebar_position: 3
---

# Project Structure

Minopamotion is organized as a monorepo with several packages.

## Package Overview

```
minopamotion/
├── packages/
│   ├── core/           # @minopamotion/core
│   ├── player/         # @minopamotion/player
│   ├── renderer/       # @minopamotion/renderer
│   ├── webcodecs/      # @minopamotion/webcodecs
│   ├── cli/            # @minopamotion/cli
│   └── studio/         # @minopamotion/studio (planned)
└── apps/
    ├── example/        # Demo application
    └── docs/           # Documentation site
```

## Dependency Flow

```
@minopamotion/cli → @minopamotion/renderer → @minopamotion/core
@minopamotion/player → @minopamotion/core
@minopamotion/webcodecs → @minopamotion/core
@minopamotion/studio → @minopamotion/core
```

The `core` package has no Minopamotion dependencies — it only requires React as a peer dependency. All other packages build on top of core.

## @minopamotion/core

The foundation. Provides:

- **Components**: `Composition`, `Sequence`, `AbsoluteFill`, `Still`, `Freeze`, `Loop`, `Series`, `Img`, `Audio`, `Video`
- **Hooks**: `useCurrentFrame()`, `useVideoConfig()`, `useDelayRender()`
- **Animation**: `interpolate()`, `interpolateColors()`, `spring()`, `measureSpring()`, `Easing`
- **Utilities**: `random()`, `staticFile()`, `delayRender()`, `continueRender()`

Core has two export paths:
- `@minopamotion/core` — public API for your videos
- `@minopamotion/core/internals` — internal contexts used by the player and renderer (not public API)

## @minopamotion/player

An embeddable React component for previewing videos in the browser. Each `Player` instance gets its own isolated context — you can have multiple Players on one page without conflicts.

## @minopamotion/renderer

Server-side rendering using Puppeteer to capture frames and FFmpeg to encode video. Used for producing final video files.

## @minopamotion/webcodecs

Client-side rendering using the browser's WebCodecs API. Encodes video directly in the browser without server infrastructure.

## @minopamotion/cli

Command-line interface for rendering videos. Wraps the renderer package with a convenient CLI.
