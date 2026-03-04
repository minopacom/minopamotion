---
sidebar_position: 1
---

# The Fundamentals

## Videos as Pure Functions

In Minopamotion, a video is a **pure function of the current frame number**. Given the same frame, a component always renders the same output.

```tsx
import { useCurrentFrame } from '@minopamotion/core';

const MyVideo: React.FC = () => {
  const frame = useCurrentFrame();
  // frame 0 → first frame, frame 1 → second frame, ...
  return <div>Current frame: {frame}</div>;
};
```

There is no timeline state to manage, no keyframes to set up, and no imperative animation API. You simply write a function that takes a frame number and returns JSX.

## Frames and Time

Frames are the fundamental unit of time. The relationship between frames and seconds depends on the frames per second (fps):

| fps | Frame 0 | Frame 30 | Frame 60 | Frame 90 |
|-----|---------|----------|----------|----------|
| 30  | 0s      | 1s       | 2s       | 3s       |
| 60  | 0s      | 0.5s     | 1s       | 1.5s     |

To convert: `seconds = frame / fps`

Access the fps and other config via `useVideoConfig()`:

```tsx
import { useCurrentFrame, useVideoConfig } from '@minopamotion/core';

const Timer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = (frame / fps).toFixed(1);
  return <div>{seconds}s elapsed</div>;
};
```

## VideoConfig

Every video has a configuration:

```tsx
type VideoConfig = {
  width: number;          // Canvas width in pixels
  height: number;         // Canvas height in pixels
  fps: number;            // Frames per second
  durationInFrames: number; // Total number of frames
};
```

This is set when you create a `Player` or `Composition` and accessed via `useVideoConfig()`.

## Deterministic Rendering

Because videos are pure functions, they are:

- **Predictable** — frame 42 always looks the same
- **Parallelizable** — frames can be rendered in any order
- **Testable** — assert what frame N looks like
- **Cacheable** — skip re-rendering unchanged frames

This is the core design principle that makes everything else possible.
