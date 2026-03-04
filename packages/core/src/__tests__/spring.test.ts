import { describe, it, expect } from 'vitest';
import { spring } from '../animation/spring.js';
import { measureSpring } from '../animation/spring-utils.js';

describe('spring', () => {
  it('starts at from value', () => {
    expect(spring({ frame: 0, fps: 30, from: 0, to: 1 })).toBe(0);
  });

  it('converges toward to value', () => {
    const val = spring({ frame: 100, fps: 30, from: 0, to: 1 });
    expect(val).toBeCloseTo(1, 2);
  });

  it('respects from and to', () => {
    const val = spring({ frame: 100, fps: 30, from: 10, to: 20 });
    expect(val).toBeCloseTo(20, 1);
  });

  it('returns to at durationInFrames', () => {
    const val = spring({ frame: 60, fps: 30, from: 0, to: 1, durationInFrames: 30 });
    expect(val).toBe(1);
  });
});

describe('measureSpring', () => {
  it('returns a positive number of frames', () => {
    const frames = measureSpring({ fps: 30 });
    expect(frames).toBeGreaterThan(0);
  });

  it('higher damping = fewer frames', () => {
    const lowDamping = measureSpring({ fps: 30, config: { damping: 5 } });
    const highDamping = measureSpring({ fps: 30, config: { damping: 30 } });
    expect(highDamping).toBeLessThan(lowDamping);
  });
});
