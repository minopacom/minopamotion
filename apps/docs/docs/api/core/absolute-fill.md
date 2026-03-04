---
sidebar_position: 3
---

# AbsoluteFill

A full-screen container that fills its parent using absolute positioning. Supports `ref` forwarding.

```tsx
import { AbsoluteFill } from '@minopamotion/core';
```

## Props

Extends all standard `HTMLAttributes<HTMLDivElement>`.

## Style

Renders a `<div>` with:

```css
position: absolute;
top: 0;
left: 0;
right: 0;
bottom: 0;
width: 100%;
height: 100%;
display: flex;
flex-direction: column;
```

## Example

```tsx
import { AbsoluteFill } from '@minopamotion/core';

const MyVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#667eea' }}>
      <h1>Full Screen Content</h1>
    </AbsoluteFill>
  );
};
```

## Layering

Stack multiple AbsoluteFill components to layer content:

```tsx
<AbsoluteFill style={{ backgroundColor: 'black' }}>
  <AbsoluteFill style={{ opacity: 0.5 }}>
    <Img src="background.jpg" />
  </AbsoluteFill>
  <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
    <h1 style={{ color: 'white' }}>Foreground</h1>
  </AbsoluteFill>
</AbsoluteFill>
```
