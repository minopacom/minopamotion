---
sidebar_position: 21
---

# staticFile()

Returns the path to a file in the `public/` directory.

```tsx
import { staticFile } from '@minopamotion/core';
```

## Signature

```tsx
function staticFile(path: string): string;
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `path` | `string` | Relative path within the public directory |

## Returns

The absolute path string (prepends `/` if not already present).

## Example

```tsx
import { staticFile, Img, Audio } from '@minopamotion/core';

const MyVideo: React.FC = () => {
  return (
    <>
      <Img src={staticFile('images/logo.png')} />
      <Audio src={staticFile('audio/music.mp3')} />
    </>
  );
};
```
