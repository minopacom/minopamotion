---
sidebar_position: 18
---

# Easing

A collection of easing functions for use with `interpolate`.

```tsx
import { Easing } from '@minopamotion/core';
```

## Functions

| Function | Description |
|----------|-------------|
| `Easing.linear` | No easing, linear interpolation |
| `Easing.ease` | CSS ease equivalent |
| `Easing.quad` | Quadratic curve |
| `Easing.cubic` | Cubic curve |
| `Easing.poly(n)` | Polynomial curve of degree n |
| `Easing.sin` | Sinusoidal curve |
| `Easing.circle` | Circular curve |
| `Easing.exp` | Exponential curve |
| `Easing.elastic(bounciness?)` | Elastic spring effect |
| `Easing.back(s?)` | Slight overshoot |
| `Easing.bounce` | Bouncing effect |
| `Easing.bezier(x1, y1, x2, y2)` | Custom cubic bezier |

## Modifiers

| Modifier | Description |
|----------|-------------|
| `Easing.in(fn)` | Apply easing at the start |
| `Easing.out(fn)` | Apply easing at the end |
| `Easing.inOut(fn)` | Apply easing at both ends |

## Example

```tsx
import { interpolate, Easing } from '@minopamotion/core';

// Ease in with cubic
const value = interpolate(frame, [0, 30], [0, 1], {
  easing: Easing.in(Easing.cubic),
});

// Custom bezier
const value = interpolate(frame, [0, 30], [0, 1], {
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
});

// Bounce
const value = interpolate(frame, [0, 30], [0, 1], {
  easing: Easing.out(Easing.bounce),
});
```
