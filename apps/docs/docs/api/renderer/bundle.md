---
sidebar_position: 4
---

# bundle()

Bundles the video project into a static site that can be served for rendering.

```tsx
import { bundle } from '@minopamotion/renderer';
```

:::info Coming Soon
This API is currently in development.
:::

## Planned Signature

```tsx
async function bundle(
  entryPoint: string,
  options?: {
    outDir?: string;
  }
): Promise<string>;
```

Returns the path to the bundled output directory.
