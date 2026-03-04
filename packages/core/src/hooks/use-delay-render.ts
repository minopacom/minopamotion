import { useContext, useEffect, useRef } from 'react';
import { DelayRenderContext } from '../contexts/delay-render-context.js';

let nextHandleId = 0;

export function useDelayRender(label = 'useDelayRender'): () => void {
  const ctx = useContext(DelayRenderContext);
  const handleId = useRef<number | null>(null);

  useEffect(() => {
    if (!ctx) return;

    const id = nextHandleId++;
    handleId.current = id;
    ctx.addHandle({ id, label });

    return () => {
      ctx.removeHandle(id);
    };
  }, [ctx, label]);

  return () => {
    if (ctx && handleId.current !== null) {
      ctx.removeHandle(handleId.current);
      handleId.current = null;
    }
  };
}
