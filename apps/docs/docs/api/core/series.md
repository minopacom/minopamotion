---
sidebar_position: 7
---

# Series

Arranges children sequentially in time. Each child plays after the previous one finishes.

```tsx
import { Series } from '@minopamotion/core';
```

Children must be `Series.Sequence` elements.

## Series.Sequence Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Content |
| `durationInFrames` | `number` | — | Duration of this segment |
| `offset` | `number` | `0` | Frame offset (positive = gap, negative = overlap) |
| `layout` | `'absolute-fill' \| 'none'` | `'absolute-fill'` | Layout mode |
| `style` | `CSSProperties` | — | Wrapper styles |
| `className` | `string` | — | Wrapper CSS class |
| `name` | `string` | — | Label for debugging |

## Example

```tsx
import { Series } from '@minopamotion/core';

const MyVideo: React.FC = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={30}>
        <Intro />
      </Series.Sequence>
      <Series.Sequence durationInFrames={60}>
        <MainContent />
      </Series.Sequence>
      <Series.Sequence durationInFrames={30}>
        <Outro />
      </Series.Sequence>
    </Series>
  );
};
```

## Offset

Use `offset` to add gaps or overlaps between segments:

```tsx
<Series>
  <Series.Sequence durationInFrames={30}>
    <First />
  </Series.Sequence>
  <Series.Sequence durationInFrames={30} offset={10}>
    <Second /> {/* Starts 10 frames after First ends */}
  </Series.Sequence>
  <Series.Sequence durationInFrames={30} offset={-5}>
    <Third /> {/* Starts 5 frames before Second ends */}
  </Series.Sequence>
</Series>
```
