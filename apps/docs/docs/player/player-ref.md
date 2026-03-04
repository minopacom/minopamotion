---
sidebar_position: 3
---

# PlayerRef

The `PlayerRef` provides an imperative API for controlling the Player programmatically.

## Getting a Ref

```tsx
import { useRef } from 'react';
import { Player, PlayerRef } from '@minopamotion/player';

const App: React.FC = () => {
  const playerRef = useRef<PlayerRef>(null);

  return (
    <>
      <Player
        ref={playerRef}
        component={MyVideo}
        compositionWidth={1920}
        compositionHeight={1080}
        fps={30}
        durationInFrames={90}
      />
      <button onClick={() => playerRef.current?.play()}>Play</button>
      <button onClick={() => playerRef.current?.pause()}>Pause</button>
    </>
  );
};
```

## Methods

### Playback

| Method | Returns | Description |
|--------|---------|-------------|
| `play()` | `void` | Start playback |
| `pause()` | `void` | Pause playback |
| `toggle()` | `void` | Toggle play/pause |
| `seekTo(frame)` | `void` | Seek to a specific frame |
| `getCurrentFrame()` | `number` | Get the current frame |
| `isPlaying()` | `boolean` | Whether the player is playing |

### Volume

| Method | Returns | Description |
|--------|---------|-------------|
| `getVolume()` | `number` | Get current volume (0–1) |
| `setVolume(volume)` | `void` | Set volume (0–1) |
| `isMuted()` | `boolean` | Whether audio is muted |
| `mute()` | `void` | Mute audio |
| `unmute()` | `void` | Unmute audio |

### Playback Rate

| Method | Returns | Description |
|--------|---------|-------------|
| `getPlaybackRate()` | `number` | Get current playback rate |
| `setPlaybackRate(rate)` | `void` | Set playback rate |

## Events

Listen for player events with `addEventListener`:

```tsx
const playerRef = useRef<PlayerRef>(null);

useEffect(() => {
  const player = playerRef.current;
  if (!player) return;

  const unsubscribe = player.addEventListener('frameupdate', (frame) => {
    console.log('Frame:', frame);
  });

  return unsubscribe;
}, []);
```

### Event Types

| Event | Data | Description |
|-------|------|-------------|
| `play` | `void` | Playback started |
| `pause` | `void` | Playback paused |
| `seeked` | `number` | Seeked to frame |
| `ended` | `void` | Playback reached the end |
| `error` | `Error` | An error occurred |
| `frameupdate` | `number` | Frame changed |
| `ratechange` | `number` | Playback rate changed |

`addEventListener` returns an unsubscribe function.
