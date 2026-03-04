---
sidebar_position: 3
---

# Thumbnail

Renders a single frame of a video. Useful for previews and galleries.

```tsx
import { Thumbnail } from '@minopamotion/player';
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `component` | `ComponentType<Props>` | Video component to render |
| `inputProps` | `Props` | Props for the video component |
| `compositionWidth` | `number` | Video width in pixels |
| `compositionHeight` | `number` | Video height in pixels |
| `fps` | `number` | Frames per second |
| `durationInFrames` | `number` | Total number of frames |
| `frameToDisplay` | `number` | Frame to render |
| `style` | `CSSProperties` | Container styles |
| `className` | `string` | Container CSS class |

## Example

```tsx
import { Thumbnail } from '@minopamotion/player';
import { MyVideo } from './MyVideo';

<Thumbnail
  component={MyVideo}
  compositionWidth={1920}
  compositionHeight={1080}
  fps={30}
  durationInFrames={90}
  frameToDisplay={45}
  style={{ width: 320 }}
/>
```
