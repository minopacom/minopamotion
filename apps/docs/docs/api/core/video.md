---
sidebar_position: 10
---

# Video

Embeds a video synchronized to the timeline.

```tsx
import { Video } from '@minopamotion/core';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | — | Video file URL |
| `volume` | `number` | `1` | Volume (0 to 1) |
| `startFrom` | `number` | `0` | Frame to start from |
| `endAt` | `number` | — | Frame to stop at |
| `playbackRate` | `number` | `1` | Playback speed |
| `muted` | `boolean` | `false` | Mute audio |
| `style` | `CSSProperties` | — | CSS styles |
| `className` | `string` | — | CSS class |

## Example

```tsx
import { Video } from '@minopamotion/core';

const MyVideo: React.FC = () => {
  return (
    <Video
      src="/background.mp4"
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      muted
    />
  );
};
```
