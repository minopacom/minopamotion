---
sidebar_position: 17
---

# measureSpring()

Calculates the number of frames a spring animation takes to settle.

```tsx
import { measureSpring } from '@minopamotion/core';
```

## Signature

```tsx
function measureSpring(options?: {
  fps?: number;
  config?: Partial<SpringConfig>;
  threshold?: number;
  from?: number;
  to?: number;
}): number;
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `fps` | `number` | `30` | Frames per second |
| `config` | `Partial<SpringConfig>` | Default spring | Spring config |
| `threshold` | `number` | `0.005` | Rest threshold |
| `from` | `number` | `0` | Start value |
| `to` | `number` | `1` | End value |

## Returns

Number of frames until the spring settles.

## Example

```tsx
import { measureSpring, Sequence } from '@minopamotion/core';

const springDuration = measureSpring({
  fps: 30,
  config: { damping: 10, stiffness: 100 },
});

// Use as Sequence duration
<Sequence durationInFrames={springDuration}>
  <SpringAnimation />
</Sequence>
```
