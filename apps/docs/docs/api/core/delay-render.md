---
sidebar_position: 19
---

# delayRender() / continueRender() / cancelRender()

Low-level API for delaying frame capture until async operations complete.

```tsx
import { delayRender, continueRender, cancelRender } from '@minopamotion/core';
```

## delayRender()

```tsx
function delayRender(label?: string): number;
```

Creates a delay handle. The frame will not be captured until all handles are continued. Returns a handle ID.

## continueRender()

```tsx
function continueRender(handleId: number): void;
```

Signals that the async operation for the given handle has completed.

## cancelRender()

```tsx
function cancelRender(error: Error | string): void;
```

Cancels the render with an error.

## Example

```tsx
import { delayRender, continueRender } from '@minopamotion/core';
import { useEffect, useState } from 'react';

const DataComponent: React.FC = () => {
  const [data, setData] = useState(null);
  const [handle] = useState(() => delayRender('Loading data'));

  useEffect(() => {
    fetch('/api/data')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        continueRender(handle);
      });
  }, [handle]);

  if (!data) return null;
  return <div>{data.title}</div>;
};
```

:::tip
For most use cases, prefer the [`useDelayRender`](/docs/api/core/use-delay-render) hook.
:::
