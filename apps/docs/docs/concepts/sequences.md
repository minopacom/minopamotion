---
sidebar_position: 3
---

# Sequences

A **Sequence** shifts the timeline for its children. It lets you arrange elements in time without manually calculating frame offsets.

## Basic Usage

```tsx
import { Sequence, useCurrentFrame } from '@minopamotion/core';

const MyVideo: React.FC = () => {
  return (
    <>
      <Sequence from={0} durationInFrames={30}>
        <Title />  {/* Visible frames 0–29 */}
      </Sequence>
      <Sequence from={30} durationInFrames={60}>
        <Content />  {/* Visible frames 30–89 */}
      </Sequence>
    </>
  );
};
```

Inside `<Title />`, `useCurrentFrame()` returns 0 at absolute frame 0, and 29 at absolute frame 29.

Inside `<Content />`, `useCurrentFrame()` returns 0 at absolute frame 30, and 59 at absolute frame 89.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `from` | `number` | `0` | When the sequence starts (absolute frame) |
| `durationInFrames` | `number` | `Infinity` | How many frames the sequence lasts |
| `name` | `string` | — | Label for debugging |
| `layout` | `'absolute-fill' \| 'none'` | `'absolute-fill'` | Layout mode |
| `style` | `CSSProperties` | — | Style applied to the wrapper |
| `className` | `string` | — | CSS class for the wrapper |

## Nesting Sequences

Sequences can be nested. Frame offsets are cumulative:

```tsx
<Sequence from={30}>
  {/* useCurrentFrame() returns 0 at absolute frame 30 */}
  <Sequence from={60}>
    {/* useCurrentFrame() returns 0 at absolute frame 90 */}
    <MyComponent />
  </Sequence>
</Sequence>
```

The math: `useCurrentFrame() = timeline.frame - cumulatedFrom - relativeFrom`

## Layout Modes

By default, each Sequence wraps its children in an `AbsoluteFill`. Set `layout="none"` to disable this:

```tsx
<Sequence from={0} layout="none">
  <span>This is inline</span>
</Sequence>
```
