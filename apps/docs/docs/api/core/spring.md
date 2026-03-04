---
sidebar_position: 16
---

# spring()

Physics-based spring animation. Returns a value that animates from `from` to `to`.

```tsx
import { spring } from '@minopamotion/core';
```

## Signature

```tsx
function spring(options: {
  frame: number;
  fps: number;
  config?: Partial<SpringConfig>;
  from?: number;
  to?: number;
  durationInFrames?: number;
  durationRestThreshold?: number;
}): number;
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `frame` | `number` | — | Current frame |
| `fps` | `number` | — | Frames per second |
| `config` | `Partial<SpringConfig>` | See below | Spring physics config |
| `from` | `number` | `0` | Start value |
| `to` | `number` | `1` | End value |
| `durationInFrames` | `number` | — | Override duration |
| `durationRestThreshold` | `number` | `0.005` | Threshold for settling |

## SpringConfig

| Property | Default | Description |
|----------|---------|-------------|
| `damping` | `10` | Resistance. Higher = less bouncy |
| `mass` | `1` | Object mass. Higher = slower |
| `stiffness` | `100` | Spring tension. Higher = faster |
| `overshootClamping` | `false` | Prevent overshooting the target |

## Example

```tsx
import { useCurrentFrame, useVideoConfig, spring } from '@minopamotion/core';

const MyComponent: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 200 },
  });

  return <div style={{ transform: `scale(${scale})` }}>Hello</div>;
};
```
