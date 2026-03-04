---
sidebar_position: 2
---

# Compositions

A **Composition** registers a video with its configuration. It defines what component to render and the video dimensions, fps, and duration.

## Defining a Composition

```tsx
import { Composition } from '@minopamotion/core';
import { MyVideo } from './MyVideo';

export const Root: React.FC = () => {
  return (
    <Composition
      id="my-video"
      component={MyVideo}
      durationInFrames={90}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
```

The `Composition` component renders nothing visually — it registers the video via a `useEffect` side effect.

## Props

| Prop | Type | Description |
|------|------|-------------|
| `id` | `string` | Unique identifier for the composition |
| `component` | `ComponentType` | The React component to render |
| `durationInFrames` | `number` | Total frames |
| `fps` | `number` | Frames per second |
| `width` | `number` | Width in pixels |
| `height` | `number` | Height in pixels |
| `defaultProps` | `object` | Default props passed to the component |

## Multiple Compositions

You can register multiple compositions in a single project:

```tsx
export const Root: React.FC = () => {
  return (
    <>
      <Composition id="intro" component={Intro} durationInFrames={150} fps={30} width={1920} height={1080} />
      <Composition id="outro" component={Outro} durationInFrames={90} fps={30} width={1920} height={1080} />
    </>
  );
};
```

## Still

A `Still` is a single-frame composition — useful for generating images:

```tsx
import { Still } from '@minopamotion/core';

<Still id="thumbnail" component={Thumbnail} width={1280} height={720} />
```

This is equivalent to a `Composition` with `durationInFrames={1}` and `fps={1}`.
