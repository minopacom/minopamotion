# Minopamotion

A video editing studio for social media automation, built on top of React and frame-based rendering.

## Overview

Minopamotion is a monorepo containing a video composition framework and interactive editor for creating programmatic videos. It's designed for social media content automation with support for multi-track editing, transitions, and real-time preview.

## Packages

### @minopamotion/core

Pure React library for programmatic video composition.

**Key Features:**
- Frame-based rendering (video as a pure function of frame number)
- `<Sequence>` component for timeline composition
- Animation utilities using `interpolate()` and `Easing`
- Support for nested sequences with cumulative frame offsets
- Zero Node.js dependencies - runs in browser

**Example:**
```tsx
import { Sequence, useCurrentFrame, interpolate } from '@minopamotion/core';

function FadeIn() {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);
  return <div style={{ opacity }}>Hello World</div>;
}

function MyVideo() {
  return (
    <Sequence from={0} durationInFrames={90}>
      <FadeIn />
    </Sequence>
  );
}
```

### @minopamotion/player

Embeddable React video player component.

**Key Features:**
- Real-time playback using `requestAnimationFrame`
- Imperative API via `PlayerRef`
- Isolated state per player instance
- Playback controls: play, pause, seek, volume, playback rate
- Event system for playback events

**Example:**
```tsx
import { Player } from '@minopamotion/player';
import { MyVideo } from './MyVideo';

function App() {
  return (
    <Player
      component={MyVideo}
      durationInFrames={90}
      fps={30}
      width={1920}
      height={1080}
      controls
    />
  );
}
```

### @minopamotion/studio

Interactive video editor studio with timeline, multi-track editing, and transitions.

**Key Features:**
- Multi-track timeline with drag-and-drop
- Asset library for media uploads (images, videos, audio)
- Element-level transitions (fade in/out)
- Timeline-level transitions (crossfades, wipes, slides, zooms)
- Real-time preview
- Transform controls (position, scale, rotation, opacity)
- Text rendering with custom styles

**Transitions:**

*Element-level transitions* - Applied to individual elements:
- Fade, slide, scale, zoom, rotate, wipe effects
- Configurable duration and easing
- Independent "in" and "out" transitions

*Timeline-level transitions* - Applied between clips:
- 10 effect types: crossfade, dissolve, wipe (left/right/up/down), slide (left/right), zoom (in/out)
- Drag and drop from Transitions panel
- Visual representation on timeline with drag handles
- Resizable duration
- Support for cross-track blending

**Example:**
```tsx
import { Studio } from '@minopamotion/studio';

function App() {
  return <Studio />;
}
```

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd minopamotion

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run the example app
cd apps/example
pnpm dev
```

## Development

```bash
# Build all packages
pnpm build

# Build specific package
pnpm --filter @minopamotion/core build

# Run tests
pnpm test

# Run tests for specific package
pnpm --filter @minopamotion/core test

# Watch mode (auto-rebuild on changes)
pnpm dev

# Clean all build outputs
pnpm clean

# Run example app (Vite dev server)
cd apps/example && pnpm dev
```

## Architecture

**Monorepo Structure:**
- `packages/core` - Core composition library
- `packages/player` - Video player component
- `packages/studio` - Video editor studio
- `apps/example` - Example application

**Build System:**
- pnpm workspaces for monorepo management
- Turborepo for build orchestration
- tsup for package bundling (ESM + CJS + types)

**Key Principles:**

1. **Frame-based rendering** - Videos are pure functions of frame number
2. **React composition** - Everything is a React component
3. **Context-based state** - Frame and playback state via React Context
4. **Deterministic rendering** - Same frame = same output
5. **Isolated instances** - Multiple players don't share state

## Usage Examples

### Creating a Simple Animation

```tsx
import { useCurrentFrame, interpolate, Easing } from '@minopamotion/core';

function MyAnimation() {
  const frame = useCurrentFrame();

  // Fade in over 30 frames
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    easing: Easing.ease
  });

  // Move from left to right
  const x = interpolate(frame, [0, 90], [0, 1920]);

  return (
    <div style={{
      opacity,
      transform: `translateX(${x}px)`
    }}>
      Hello World
    </div>
  );
}
```

### Using the Studio

1. **Upload Media** - Click "+ Upload" in the Media tab
2. **Add to Timeline** - Click an asset to add it to the first track
3. **Add Transitions** - Switch to Transitions tab and drag effects onto timeline
4. **Transform Elements** - Select and drag elements on canvas or adjust in inspector
5. **Preview** - Use the player controls to preview your composition

### Timeline Transitions Workflow

1. Add multiple video/image elements to your timeline
2. Click the "Transitions" tab in the asset library (left panel)
3. Drag a transition effect (e.g., "Crossfade") onto the timeline
4. Position it where you want the transition to occur
5. Resize the transition by dragging its edges to adjust duration
6. Play the preview to see the transition effect

## Technical Details

### Frame Calculation

The core uses a context chain to calculate the current frame:

```
useCurrentFrame() = TimelineContext.frame
                  - SequenceContext.cumulatedFrom
                  - SequenceContext.relativeFrom
```

Nested sequences accumulate offsets:
```tsx
<Sequence from={30}>           {/* Outer starts at frame 30 */}
  <Sequence from={60}>         {/* Inner starts at frame 90 (30 + 60) */}
    <MyComponent />            {/* Sees frame 0 at absolute frame 90 */}
  </Sequence>
</Sequence>
```

### Transitions System

**Element Transitions** - Applied in `ElementRenderer`:
- Reads `element.transitions.in` and `element.transitions.out`
- Calculates styles using `calculateTransitionStyles()`
- Returns opacity, transform, and clipPath CSS properties

**Timeline Transitions** - Applied in `ElementRenderer`:
- Reads `editorScene.timelineTransitions`
- Calculates effects using `calculateTimelineTransitionEffect()`
- Determines if element is fading in or out based on time range
- Supports cross-track blending via `beforeElementId`/`afterElementId`

## Contributing

This is an internal project for Minopa. See [CLAUDE.md](./CLAUDE.md) for detailed development guidelines.

## License

Proprietary - All rights reserved
