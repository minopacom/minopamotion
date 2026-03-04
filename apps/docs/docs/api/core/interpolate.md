---
sidebar_position: 14
---

# interpolate()

Maps an input value from one range to another, with optional easing and extrapolation.

```tsx
import { interpolate } from '@minopamotion/core';
```

## Signature

```tsx
function interpolate(
  input: number,
  inputRange: readonly number[],
  outputRange: readonly number[],
  options?: {
    easing?: (t: number) => number;
    extrapolateLeft?: 'extend' | 'clamp' | 'identity';
    extrapolateRight?: 'extend' | 'clamp' | 'identity';
  }
): number;
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `number` | The input value |
| `inputRange` | `number[]` | Monotonically increasing input values |
| `outputRange` | `number[]` | Corresponding output values (same length as inputRange) |
| `options.easing` | `(t: number) => number` | Easing function |
| `options.extrapolateLeft` | `string` | Behavior when input is below the range. Default: `'extend'` |
| `options.extrapolateRight` | `string` | Behavior when input is above the range. Default: `'extend'` |

## Extrapolation Modes

- **`extend`** — continues the curve beyond the range
- **`clamp`** — clamps to the nearest output value
- **`identity`** — returns the input value unchanged

## Examples

```tsx
// Fade in over 30 frames
const opacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateRight: 'clamp',
});

// Multi-segment animation
const opacity = interpolate(frame, [0, 30, 60, 90], [0, 1, 1, 0]);

// With easing
const scale = interpolate(frame, [0, 30], [0, 1], {
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  extrapolateRight: 'clamp',
});
```
