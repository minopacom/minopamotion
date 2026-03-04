import type { ComponentType } from 'react';

export interface VideoConfig {
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
}

export interface TComposition<Props extends Record<string, unknown> = Record<string, unknown>>
  extends VideoConfig {
  id: string;
  component: ComponentType<Props>;
  defaultProps?: Props;
  nonce: number;
}

export type CompositionManagerAction =
  | { type: 'REGISTER'; composition: TComposition }
  | { type: 'UNREGISTER'; id: string };
