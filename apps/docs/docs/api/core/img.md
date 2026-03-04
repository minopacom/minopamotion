---
sidebar_position: 8
---

# Img

Renders an image with delay render support. The render waits until the image has loaded.

```tsx
import { Img } from '@minopamotion/core';
```

## Props

Extends all standard `ImgHTMLAttributes<HTMLImageElement>`.

## Example

```tsx
import { Img } from '@minopamotion/core';

const MyVideo: React.FC = () => {
  return (
    <Img
      src="https://example.com/photo.jpg"
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
};
```

The component uses `delayRender` internally — the frame is not captured until the image has loaded, preventing blank frames during server-side rendering.
