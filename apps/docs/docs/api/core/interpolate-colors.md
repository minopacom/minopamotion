---
sidebar_position: 15
---

# interpolateColors()

Interpolates between colors. Supports hex, rgb, and rgba formats.

```tsx
import { interpolateColors } from '@minopamotion/core';
```

## Signature

```tsx
function interpolateColors(
  input: number,
  inputRange: readonly number[],
  outputColors: readonly string[]
): string;
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `number` | The input value |
| `inputRange` | `number[]` | Monotonically increasing input values |
| `outputColors` | `string[]` | Colors to interpolate between |

## Supported Formats

- Hex: `#FFF`, `#FFFFFF`, `#FFFFFF80`
- RGB: `rgb(255, 255, 255)`
- RGBA: `rgba(255, 255, 255, 0.5)`

## Returns

An `rgba()` string.

## Example

```tsx
import { useCurrentFrame, interpolateColors } from '@minopamotion/core';

const MyComponent: React.FC = () => {
  const frame = useCurrentFrame();
  const color = interpolateColors(
    frame,
    [0, 30, 60],
    ['#667eea', '#764ba2', '#f093fb']
  );
  return <div style={{ backgroundColor: color, flex: 1 }} />;
};
```
