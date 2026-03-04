import { type ComponentType, useEffect, useRef } from 'react';
import { useCompositionManager } from '../contexts/composition-manager.js';
import type { TComposition } from '../types/composition.js';

interface StillProps<Props extends Record<string, unknown> = Record<string, unknown>> {
  id: string;
  component: ComponentType<Props>;
  width: number;
  height: number;
  defaultProps?: Props;
}

let nonceCounter = 0;

export function Still<Props extends Record<string, unknown> = Record<string, unknown>>({
  id,
  component,
  width,
  height,
  defaultProps,
}: StillProps<Props>) {
  const { registerComposition, unregisterComposition } = useCompositionManager();
  const nonce = useRef(nonceCounter++);

  useEffect(() => {
    const comp: TComposition = {
      id,
      component: component as ComponentType<Record<string, unknown>>,
      durationInFrames: 1,
      fps: 1,
      width,
      height,
      defaultProps,
      nonce: nonce.current,
    };

    registerComposition(comp);

    return () => {
      unregisterComposition(id);
    };
  }, [id, component, width, height, defaultProps, registerComposition, unregisterComposition]);

  return null;
}
