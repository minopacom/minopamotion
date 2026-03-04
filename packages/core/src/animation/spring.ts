import type { SpringConfig } from '../types/common.js';
import { advanceSpring, defaultSpringConfig, type SpringState } from './spring-utils.js';

interface SpringOptions {
  frame: number;
  fps: number;
  config?: Partial<SpringConfig>;
  from?: number;
  to?: number;
  durationInFrames?: number;
  durationRestThreshold?: number;
}

export function spring({
  frame,
  fps,
  config: userConfig,
  from = 0,
  to = 1,
  durationInFrames,
  durationRestThreshold = 0.005,
}: SpringOptions): number {
  const config = { ...defaultSpringConfig, ...userConfig };
  const dt = 1 / fps;
  let state: SpringState = { position: from, velocity: 0 };

  const effectiveFrames = durationInFrames ?? Infinity;

  for (let i = 0; i < Math.min(frame, effectiveFrames); i++) {
    state = advanceSpring(config, state, to, dt);
  }

  if (frame >= effectiveFrames) {
    return to;
  }

  if (
    Math.abs(state.position - to) < durationRestThreshold &&
    Math.abs(state.velocity) < durationRestThreshold
  ) {
    return to;
  }

  return state.position;
}
