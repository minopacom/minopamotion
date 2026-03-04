---
sidebar_position: 9
---

# Audio

Plays audio synchronized to the timeline.

```tsx
import { Audio } from '@minopamotion/core';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | — | Audio file URL |
| `volume` | `number` | `1` | Volume (0 to 1) |
| `startFrom` | `number` | `0` | Frame to start from |
| `endAt` | `number` | — | Frame to stop at |
| `playbackRate` | `number` | `1` | Playback speed |

## Example

```tsx
import { Audio } from '@minopamotion/core';

const MyVideo: React.FC = () => {
  return (
    <>
      <Audio src="/narration.mp3" />
      <Audio src="/music.mp3" volume={0.3} />
    </>
  );
};
```

Audio is automatically synchronized with the Player's timeline. Seeking the player also seeks the audio.
