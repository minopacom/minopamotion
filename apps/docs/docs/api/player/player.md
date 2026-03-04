---
sidebar_position: 1
---

# Player

Embeddable React component for previewing Minopamotion videos.

```tsx
import { Player } from '@minopamotion/player';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `component` | `ComponentType<Props>` | — | Video component to render |
| `inputProps` | `Props` | — | Props passed to the video component |
| `compositionWidth` | `number` | — | Video width in pixels |
| `compositionHeight` | `number` | — | Video height in pixels |
| `fps` | `number` | — | Frames per second |
| `durationInFrames` | `number` | — | Total number of frames |
| `loop` | `boolean` | `false` | Loop playback |
| `autoPlay` | `boolean` | `false` | Auto-start playback |
| `controls` | `boolean` | `true` | Show playback controls |
| `style` | `CSSProperties` | — | Container styles |
| `className` | `string` | — | Container CSS class |
| `clickToPlay` | `boolean` | `true` | Click to toggle playback |
| `doubleClickToFullscreen` | `boolean` | — | Double-click for fullscreen |
| `initialFrame` | `number` | — | Starting frame |
| `playbackRate` | `number` | `1` | Playback speed |
| `showVolumeControls` | `boolean` | `true` | Show volume controls |

## Example

```tsx
import { Player } from '@minopamotion/player';
import { MyVideo } from './MyVideo';

<Player
  component={MyVideo}
  inputProps={{ title: 'Hello' }}
  compositionWidth={1920}
  compositionHeight={1080}
  fps={30}
  durationInFrames={90}
  controls
  loop
  style={{ width: '100%' }}
/>
```

## See Also

- [PlayerRef](/docs/api/player/player-ref) — imperative API
- [Thumbnail](/docs/api/player/thumbnail) — single-frame rendering
