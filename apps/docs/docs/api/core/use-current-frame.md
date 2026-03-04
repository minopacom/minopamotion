---
sidebar_position: 11
---

# useCurrentFrame()

Returns the current frame number. Inside a `Sequence`, the frame is relative to the sequence start.

```tsx
import { useCurrentFrame } from '@minopamotion/core';
```

## Signature

```tsx
function useCurrentFrame(): number;
```

## Returns

The current frame number (integer, starting from 0).

## How It Works

The returned value depends on the Sequence context:

```
useCurrentFrame() = timeline.frame - cumulatedFrom - relativeFrom
```

At the top level (no Sequence), it returns the absolute timeline frame. Inside a Sequence, it returns the frame relative to that sequence's start.

## Example

```tsx
import { useCurrentFrame, interpolate } from '@minopamotion/core';

const FadeIn: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });
  return <div style={{ opacity }}>Hello</div>;
};
```
