---
sidebar_position: 5
---

# serve()

Starts a local HTTP server to serve a bundled video project.

```tsx
import { serve } from '@minopamotion/renderer';
```

:::info Coming Soon
This API is currently in development.
:::

## Planned Signature

```tsx
async function serve(options: {
  bundleDir: string;
  port?: number;
}): Promise<{
  url: string;
  close: () => Promise<void>;
}>;
```
