---
sidebar_position: 5
---

# Freeze

Freezes the timeline at a specific frame. Children always see the given frame number regardless of the actual current frame.

```tsx
import { Freeze } from '@minopamotion/core';
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Content to freeze |
| `frame` | `number` | The frame to freeze at |

## Example

```tsx
import { Freeze, useCurrentFrame } from '@minopamotion/core';

const MyVideo: React.FC = () => {
  return (
    <Freeze frame={15}>
      <AnimatedComponent /> {/* Always sees frame 15 */}
    </Freeze>
  );
};
```
