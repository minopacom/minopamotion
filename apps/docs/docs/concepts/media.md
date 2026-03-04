---
sidebar_position: 5
---

# Media

Minopamotion provides components for embedding images, audio, and video that synchronize with the timeline.

## Img

Renders an image with delay render support — the render waits until the image is loaded:

```tsx
import { Img } from '@minopamotion/core';

const MyVideo: React.FC = () => {
  return <Img src="https://example.com/photo.jpg" style={{ width: '100%' }} />;
};
```

`Img` extends standard `<img>` attributes.

## Audio

Plays audio synchronized to the timeline:

```tsx
import { Audio } from '@minopamotion/core';

const MyVideo: React.FC = () => {
  return <Audio src="/music.mp3" volume={0.8} />;
};
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | — | Audio file URL |
| `volume` | `number` | `1` | Volume (0 to 1) |
| `startFrom` | `number` | `0` | Frame to start playing from |
| `endAt` | `number` | — | Frame to stop playing at |
| `playbackRate` | `number` | `1` | Playback speed |

Audio is automatically synced to the current frame. Seeking the player also seeks the audio.

## Video

Embeds a video synchronized to the timeline:

```tsx
import { Video } from '@minopamotion/core';

const MyVideo: React.FC = () => {
  return (
    <Video
      src="/background.mp4"
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
};
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | — | Video file URL |
| `volume` | `number` | `1` | Volume (0 to 1) |
| `startFrom` | `number` | `0` | Frame to start playing from |
| `endAt` | `number` | — | Frame to stop playing at |
| `playbackRate` | `number` | `1` | Playback speed |
| `muted` | `boolean` | `false` | Mute audio |
| `style` | `CSSProperties` | — | CSS styles |
| `className` | `string` | — | CSS class |

## staticFile

Reference files from the `public/` directory:

```tsx
import { staticFile, Audio, Img } from '@minopamotion/core';

const MyVideo: React.FC = () => {
  return (
    <>
      <Img src={staticFile('logo.png')} />
      <Audio src={staticFile('music.mp3')} />
    </>
  );
};
```

`staticFile('logo.png')` returns `'/logo.png'`.
