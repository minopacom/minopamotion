---
sidebar_position: 12
---

# useVideoConfig()

Returns the video configuration. Throws if called outside a `Composition` or `Player`.

```tsx
import { useVideoConfig } from '@minopamotion/core';
```

## Signature

```tsx
function useVideoConfig(): VideoConfig;
```

## Returns

```tsx
type VideoConfig = {
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
};
```

## Example

```tsx
import { useVideoConfig } from '@minopamotion/core';

const MyVideo: React.FC = () => {
  const { width, height, fps, durationInFrames } = useVideoConfig();
  return (
    <div>
      {width}x{height} @ {fps}fps, {durationInFrames} frames
    </div>
  );
};
```
