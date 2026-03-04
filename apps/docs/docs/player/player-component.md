---
sidebar_position: 2
---

# Player Component

The `Player` component renders a Minopamotion video with playback controls.

## Usage

```tsx
import { Player } from '@minopamotion/player';
import { MyVideo } from './MyVideo';

<Player
  component={MyVideo}
  compositionWidth={1920}
  compositionHeight={1080}
  fps={30}
  durationInFrames={90}
  controls
  style={{ width: '100%' }}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `component` | `ComponentType` | — | The video component to render |
| `inputProps` | `object` | — | Props passed to the video component |
| `compositionWidth` | `number` | — | Video width in pixels |
| `compositionHeight` | `number` | — | Video height in pixels |
| `fps` | `number` | — | Frames per second |
| `durationInFrames` | `number` | — | Total number of frames |
| `loop` | `boolean` | `false` | Loop playback |
| `autoPlay` | `boolean` | `false` | Start playing automatically |
| `controls` | `boolean` | `true` | Show playback controls |
| `style` | `CSSProperties` | — | Container styles |
| `className` | `string` | — | Container CSS class |
| `clickToPlay` | `boolean` | `true` | Click the player to toggle playback |
| `doubleClickToFullscreen` | `boolean` | — | Double-click to enter fullscreen |
| `initialFrame` | `number` | — | Frame to start at |
| `playbackRate` | `number` | `1` | Playback speed |
| `showVolumeControls` | `boolean` | `true` | Show volume controls |

## Responsive Sizing

The Player preserves the aspect ratio defined by `compositionWidth` and `compositionHeight`. To make it responsive, set a width on the container:

```tsx
<Player
  component={MyVideo}
  compositionWidth={1920}
  compositionHeight={1080}
  fps={30}
  durationInFrames={90}
  style={{ width: '100%' }}
/>
```

## Passing Props to the Video

Use `inputProps` to pass data to your video component:

```tsx
<Player
  component={MyVideo}
  inputProps={{ title: 'Hello', color: '#667eea' }}
  compositionWidth={1920}
  compositionHeight={1080}
  fps={30}
  durationInFrames={90}
/>
```

## Multiple Players

Each Player instance is fully isolated. You can render multiple Players on the same page:

```tsx
<Player component={VideoA} compositionWidth={1920} compositionHeight={1080} fps={30} durationInFrames={90} />
<Player component={VideoB} compositionWidth={1280} compositionHeight={720} fps={24} durationInFrames={120} />
```
