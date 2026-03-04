---
sidebar_position: 4
---

# Animation

Minopamotion provides two animation primitives: `interpolate` for linear/eased animations and `spring` for physics-based animations.

## interpolate

Maps an input value from one range to another:

```tsx
import { useCurrentFrame, interpolate } from '@minopamotion/core';

const MyComponent: React.FC = () => {
  const frame = useCurrentFrame();

  // Fade in over the first 30 frames
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return <div style={{ opacity }}>Hello</div>;
};
```

### Options

```tsx
interpolate(input, inputRange, outputRange, {
  easing: Easing.bezier(0.25, 0.1, 0.25, 1), // easing function
  extrapolateLeft: 'clamp',   // 'extend' | 'clamp' | 'identity'
  extrapolateRight: 'clamp',  // 'extend' | 'clamp' | 'identity'
});
```

- **`extend`** (default) — continues the curve beyond the range
- **`clamp`** — clamps to the nearest output value
- **`identity`** — returns the input value unchanged

### Multiple Segments

```tsx
const opacity = interpolate(frame, [0, 30, 60, 90], [0, 1, 1, 0]);
// 0→30: fade in, 30→60: stay visible, 60→90: fade out
```

## spring

Physics-based spring animation:

```tsx
import { useCurrentFrame, useVideoConfig, spring } from '@minopamotion/core';

const MyComponent: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: {
      damping: 10,
      mass: 1,
      stiffness: 100,
    },
  });

  return <div style={{ transform: `scale(${scale})` }}>Boing!</div>;
};
```

### SpringConfig

| Property | Default | Description |
|----------|---------|-------------|
| `damping` | `10` | Resistance force. Higher = less bouncy |
| `mass` | `1` | Object mass. Higher = slower |
| `stiffness` | `100` | Spring tension. Higher = faster |
| `overshootClamping` | `false` | Prevent overshooting the target |

### Custom Range

```tsx
const value = spring({
  frame,
  fps,
  from: 0,    // start value (default: 0)
  to: 100,    // end value (default: 1)
});
```

## measureSpring

Calculate how many frames a spring animation takes to settle:

```tsx
import { measureSpring } from '@minopamotion/core';

const duration = measureSpring({
  fps: 30,
  config: { damping: 10, mass: 1, stiffness: 100 },
}); // e.g., 28 frames
```

Useful for calculating `durationInFrames` for a Sequence that contains a spring animation.

## Easing

The `Easing` module provides easing functions for use with `interpolate`:

```tsx
import { interpolate, Easing } from '@minopamotion/core';

const value = interpolate(frame, [0, 30], [0, 1], {
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
});
```

Available easing functions: `linear`, `ease`, `quad`, `cubic`, `sin`, `circle`, `exp`, `elastic`, `back`, `bounce`, `bezier`, `poly`.

Modifiers: `Easing.in(fn)`, `Easing.out(fn)`, `Easing.inOut(fn)`.

## interpolateColors

Interpolate between colors:

```tsx
import { useCurrentFrame, interpolateColors } from '@minopamotion/core';

const MyComponent: React.FC = () => {
  const frame = useCurrentFrame();
  const color = interpolateColors(frame, [0, 60], ['#667eea', '#764ba2']);
  return <div style={{ backgroundColor: color }}>Color shift</div>;
};
```

Supports hex (`#FFF`, `#FFFFFF`), `rgb()`, and `rgba()` formats. Returns an `rgba()` string.
