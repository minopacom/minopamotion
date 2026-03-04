import { useEffect, useRef, type ComponentType } from 'react';
import { useCompositionManager } from '../contexts/composition-manager.js';
import type { TComposition } from '../types/composition.js';

interface CompositionProps<Props extends Record<string, unknown> = Record<string, unknown>> {
  id: string;
  component: ComponentType<Props>;
  durationInFrames: number;
  fps: number;
  width: number;
  height: number;
  defaultProps?: Props;
}

let nonceCounter = 0;

export function Composition<Props extends Record<string, unknown> = Record<string, unknown>>({
  id,
  component,
  durationInFrames,
  fps,
  width,
  height,
  defaultProps,
}: CompositionProps<Props>) {
  const { registerComposition, unregisterComposition } = useCompositionManager();
  const nonce = useRef(nonceCounter++);

  useEffect(() => {
    const comp: TComposition = {
      id,
      component: component as ComponentType<Record<string, unknown>>,
      durationInFrames,
      fps,
      width,
      height,
      defaultProps,
      nonce: nonce.current,
    };

    registerComposition(comp);

    return () => {
      unregisterComposition(id);
    };
  }, [id, component, durationInFrames, fps, width, height, defaultProps, registerComposition, unregisterComposition]);

  return null;
}
