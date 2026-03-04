---
sidebar_position: 4
---

# Thumbnail

The `Thumbnail` component renders a single frame of a video — useful for previews, social cards, or video galleries.

## Usage

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

## Props

| Prop | Type | Description |
|------|------|-------------|
| `component` | `ComponentType` | The video component to render |
| `inputProps` | `object` | Props passed to the video component |
| `compositionWidth` | `number` | Video width in pixels |
| `compositionHeight` | `number` | Video height in pixels |
| `fps` | `number` | Frames per second |
| `durationInFrames` | `number` | Total number of frames |
| `frameToDisplay` | `number` | The frame to render |
| `style` | `CSSProperties` | Container styles |
| `className` | `string` | Container CSS class |

## Example: Video Gallery

```tsx
const frames = [0, 30, 60, 90, 120];

const Gallery: React.FC = () => {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      {frames.map((frame) => (
        <Thumbnail
          key={frame}
          component={MyVideo}
          compositionWidth={1920}
          compositionHeight={1080}
          fps={30}
          durationInFrames={150}
          frameToDisplay={frame}
          style={{ width: 200 }}
        />
      ))}
    </div>
  );
};
```
