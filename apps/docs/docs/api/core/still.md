---
sidebar_position: 4
---

# Still

A single-frame composition for generating images. Equivalent to a `Composition` with `durationInFrames={1}` and `fps={1}`.

```tsx
import { Still } from '@minopamotion/core';
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | Yes | Unique identifier |
| `component` | `ComponentType<Props>` | Yes | React component to render |
| `width` | `number` | Yes | Width in pixels |
| `height` | `number` | Yes | Height in pixels |
| `defaultProps` | `Props` | No | Default props for the component |

## Example

```tsx
import { Still } from '@minopamotion/core';
import { Thumbnail } from './Thumbnail';

<Still
  id="thumbnail"
  component={Thumbnail}
  width={1280}
  height={720}
/>
```
