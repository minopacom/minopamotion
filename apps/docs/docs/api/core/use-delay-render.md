---
sidebar_position: 13
---

# useDelayRender()

Hook version of `delayRender` / `continueRender`. Delays rendering until the returned callback is called.

```tsx
import { useDelayRender } from '@minopamotion/core';
```

## Signature

```tsx
function useDelayRender(label?: string): () => void;
```

## Returns

A `continueRender` callback. Call it when your async operation completes.

## Example

```tsx
import { useDelayRender } from '@minopamotion/core';
import { useState, useEffect } from 'react';

const DataComponent: React.FC = () => {
  const [data, setData] = useState(null);
  const continueRender = useDelayRender('Loading data');

  useEffect(() => {
    fetch('/api/data')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        continueRender();
      });
  }, []);

  if (!data) return null;
  return <div>{data.title}</div>;
};
```
