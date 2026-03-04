---
sidebar_position: 2
---

# Your First Video

This guide walks you through creating a simple video with Minopamotion and previewing it in the browser.

## 1. Create a Video Component

A video is just a React component. Create a file called `MyVideo.tsx`:

```tsx
import { useCurrentFrame, useVideoConfig, interpolate } from '@minopamotion/core';

export const MyVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, fps], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const scale = interpolate(frame, [0, fps], [0.5, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <h1
        style={{
          opacity,
          transform: `scale(${scale})`,
          color: 'white',
          fontSize: 80,
        }}
      >
        Hello, Minopamotion!
      </h1>
    </div>
  );
};
```

## 2. Preview with the Player

Use the `Player` component to preview your video in the browser:

```tsx
import { Player } from '@minopamotion/player';
import { MyVideo } from './MyVideo';

export const App: React.FC = () => {
  return (
    <Player
      component={MyVideo}
      compositionWidth={1920}
      compositionHeight={1080}
      fps={30}
      durationInFrames={90}
      controls
      style={{ width: '100%' }}
    />
  );
};
```

This renders a player with playback controls. The video is 1920x1080 at 30fps, lasting 3 seconds (90 frames).

## 3. What Just Happened?

- **`useCurrentFrame()`** returns the current frame number (0, 1, 2, ...)
- **`useVideoConfig()`** returns the video configuration (width, height, fps, durationInFrames)
- **`interpolate()`** maps the frame number to animation values (opacity, scale, position, etc.)
- **`Player`** provides the timeline context and renders your component at each frame

The video is fully deterministic — frame 15 always looks exactly the same.

## Next Steps

- [Project Structure](/docs/getting-started/project-structure) — understand how the packages fit together
- [Compositions](/docs/concepts/compositions) — register multiple videos
- [Sequences](/docs/concepts/sequences) — arrange elements in time
