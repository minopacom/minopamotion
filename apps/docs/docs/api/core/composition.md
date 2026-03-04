---
sidebar_position: 1
---

# Composition

Registers a video composition with its configuration. The component renders nothing — it registers via a `useEffect` side effect.

```tsx
import { Composition } from '@minopamotion/core';
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | Yes | Unique identifier |
| `component` | `ComponentType<Props>` | Yes | React component to render |
| `durationInFrames` | `number` | Yes | Total number of frames |
| `fps` | `number` | Yes | Frames per second |
| `width` | `number` | Yes | Width in pixels |
| `height` | `number` | Yes | Height in pixels |
| `defaultProps` | `Props` | No | Default props for the component |

## Example

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
