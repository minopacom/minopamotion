---
sidebar_position: 2
---

# Sequence

Shifts the timeline for its children. Inside a Sequence, `useCurrentFrame()` returns 0 at the frame specified by `from`.

```tsx
import { Sequence } from '@minopamotion/core';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Content to render |
| `from` | `number` | `0` | When the sequence starts (absolute frame) |
| `durationInFrames` | `number` | `Infinity` | How many frames the sequence lasts |
| `name` | `string` | — | Label for debugging |
| `layout` | `'absolute-fill' \| 'none'` | `'absolute-fill'` | Layout mode |
| `style` | `CSSProperties` | — | Wrapper styles |
| `className` | `string` | — | Wrapper CSS class |

## Example

```tsx
<Sequence from={30} durationInFrames={60}>
  <MyComponent /> {/* useCurrentFrame() returns 0 at absolute frame 30 */}
</Sequence>
```

## Nesting

Frame offsets are cumulative:

```tsx
<Sequence from={30}>
  <Sequence from={60}>
    {/* useCurrentFrame() returns 0 at absolute frame 90 */}
  </Sequence>
</Sequence>
```
