---
sidebar_position: 20
---

# random()

Deterministic pseudo-random number generator. Given the same seed, always returns the same value.

```tsx
import { random } from '@minopamotion/core';
```

## Signature

```tsx
function random(seed: number | string): number;
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `seed` | `number \| string` | Seed for the PRNG |

## Returns

A number between 0 (inclusive) and 1 (exclusive).

## Why Deterministic?

Using `Math.random()` in a video component would produce different results on each render, breaking the deterministic rendering principle. `random()` ensures the same seed always produces the same value.

## Example

```tsx
import { random } from '@minopamotion/core';

const MyVideo: React.FC = () => {
  const dots = new Array(50).fill(null).map((_, i) => ({
    x: random(`x-${i}`) * 1920,
    y: random(`y-${i}`) * 1080,
    size: random(`size-${i}`) * 20 + 5,
  }));

  return (
    <AbsoluteFill>
      {dots.map((dot, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: dot.x,
            top: dot.y,
            width: dot.size,
            height: dot.size,
            borderRadius: '50%',
            backgroundColor: 'white',
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
```
