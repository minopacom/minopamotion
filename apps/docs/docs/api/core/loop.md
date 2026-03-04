---
sidebar_position: 6
---

# Loop

Repeats its children for a specified number of times or indefinitely.

```tsx
import { Loop } from '@minopamotion/core';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Content to loop |
| `durationInFrames` | `number` | — | Duration of one iteration |
| `times` | `number` | `Infinity` | Number of repetitions |
| `layout` | `'absolute-fill' \| 'none'` | `'absolute-fill'` | Layout mode |
| `style` | `CSSProperties` | — | Wrapper styles |

## Example

```tsx
import { Loop } from '@minopamotion/core';

const MyVideo: React.FC = () => {
  return (
    <Loop durationInFrames={30} times={3}>
      <PulsingDot /> {/* Repeats 3 times, 30 frames each */}
    </Loop>
  );
};
```
