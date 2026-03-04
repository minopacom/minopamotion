---
sidebar_position: 2
---

# PlayerRef

Imperative API for controlling the Player programmatically.

```tsx
import { Player, PlayerRef } from '@minopamotion/player';
```

## Usage

```tsx
import { useRef } from 'react';
import { Player, PlayerRef } from '@minopamotion/player';

const App: React.FC = () => {
  const ref = useRef<PlayerRef>(null);

  return (
    <>
      <Player ref={ref} component={MyVideo} compositionWidth={1920} compositionHeight={1080} fps={30} durationInFrames={90} />
      <button onClick={() => ref.current?.play()}>Play</button>
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
| `seekTo(frame)` | `void` | Seek to frame |
| `getCurrentFrame()` | `number` | Current frame |
| `isPlaying()` | `boolean` | Playing state |

### Volume

| Method | Returns | Description |
|--------|---------|-------------|
| `getVolume()` | `number` | Current volume (0–1) |
| `setVolume(volume)` | `void` | Set volume |
| `isMuted()` | `boolean` | Muted state |
| `mute()` | `void` | Mute audio |
| `unmute()` | `void` | Unmute audio |

### Playback Rate

| Method | Returns | Description |
|--------|---------|-------------|
| `getPlaybackRate()` | `number` | Current rate |
| `setPlaybackRate(rate)` | `void` | Set rate |

### Events

```tsx
addEventListener<K extends keyof PlayerEventMap>(
  event: K,
  listener: (data: PlayerEventMap[K]) => void
): () => void;
```

Returns an unsubscribe function.

## PlayerEventMap

| Event | Data | Description |
|-------|------|-------------|
| `play` | `void` | Playback started |
| `pause` | `void` | Playback paused |
| `seeked` | `number` | Seeked to frame |
| `ended` | `void` | Playback ended |
| `error` | `Error` | Error occurred |
| `frameupdate` | `number` | Frame changed |
| `ratechange` | `number` | Playback rate changed |
