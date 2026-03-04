---
sidebar_position: 1
---

# Player Overview

The `@minopamotion/player` package provides an embeddable React component for previewing Minopamotion videos in the browser.

## Features

- **Playback controls** — play, pause, seek, volume, playback rate
- **Fully isolated** — multiple Players on one page don't share state
- **Responsive** — scales to fit its container
- **Imperative API** — control playback programmatically via ref
- **Event system** — listen for play, pause, seek, frame updates, and more
- **Lightweight** — no external dependencies beyond React and `@minopamotion/core`

## Quick Start

```tsx
import { Player } from '@minopamotion/player';
import { MyVideo } from './MyVideo';

export const App: React.FC = () => {
  return (
    <Player
      component={MyVideo}
      compositionWidth={1920}
      compositionHeight={1080}
      fps={30}
      durationInFrames={90}
      controls
    />
  );
};
```

## How It Works

Each Player instance creates an isolated context tree:

- **TimelineContext** — current frame, playing state, playback rate
- **VideoConfigContext** — width, height, fps, durationInFrames
- **MediaVolumeContext** — volume and mute state
- **DelayRenderContext** — delay render handles

The playback loop uses `requestAnimationFrame` for smooth animation, with a `setTimeout` fallback when the browser tab is backgrounded.

## Installation

```bash
pnpm add @minopamotion/player @minopamotion/core react react-dom
```
