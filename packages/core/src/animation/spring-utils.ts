import type { SpringConfig } from '../types/common.js';

export const defaultSpringConfig: SpringConfig = {
  damping: 10,
  mass: 1,
  stiffness: 100,
  overshootClamping: false,
};

export interface SpringState {
  position: number;
  velocity: number;
}

export function advanceSpring(
  config: SpringConfig,
  state: SpringState,
  toValue: number,
  dt: number,
): SpringState {
  const { damping, mass, stiffness, overshootClamping } = config;

  const displacement = state.position - toValue;
  const springForce = -stiffness * displacement;
  const dampingForce = -damping * state.velocity;
  const acceleration = (springForce + dampingForce) / mass;

  const newVelocity = state.velocity + acceleration * dt;
  let newPosition = state.position + newVelocity * dt;

  if (overshootClamping) {
    if (state.position < toValue && newPosition > toValue) newPosition = toValue;
    if (state.position > toValue && newPosition < toValue) newPosition = toValue;
  }

  return { position: newPosition, velocity: newVelocity };
}

export function measureSpring({
  fps = 30,
  config = defaultSpringConfig,
  threshold = 0.005,
  from = 0,
  to = 1,
}: {
  fps?: number;
  config?: Partial<SpringConfig>;
  threshold?: number;
  from?: number;
  to?: number;
} = {}): number {
  const fullConfig = { ...defaultSpringConfig, ...config };
  const dt = 1 / fps;
  let state: SpringState = { position: from, velocity: 0 };
  let frames = 0;

  for (let i = 0; i < 10000; i++) {
    state = advanceSpring(fullConfig, state, to, dt);
    frames++;
    if (Math.abs(state.position - to) < threshold && Math.abs(state.velocity) < threshold) {
      return frames;
    }
  }

  return frames;
}
