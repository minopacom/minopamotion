import { describe, it, expect } from 'vitest';
import { interpolate } from '../animation/interpolate.js';

describe('interpolate', () => {
  it('basic linear interpolation', () => {
    expect(interpolate(5, [0, 10], [0, 100])).toBe(50);
    expect(interpolate(0, [0, 10], [0, 100])).toBe(0);
    expect(interpolate(10, [0, 10], [0, 100])).toBe(100);
  });

  it('multi-segment interpolation', () => {
    expect(interpolate(5, [0, 5, 10], [0, 50, 200])).toBe(50);
    expect(interpolate(7.5, [0, 5, 10], [0, 50, 200])).toBe(125);
  });

  it('clamp extrapolation', () => {
    expect(interpolate(-5, [0, 10], [0, 100], { extrapolateLeft: 'clamp' })).toBe(0);
    expect(interpolate(15, [0, 10], [0, 100], { extrapolateRight: 'clamp' })).toBe(100);
  });

  it('identity extrapolation', () => {
    expect(interpolate(-5, [0, 10], [0, 100], { extrapolateLeft: 'identity' })).toBe(-5);
    expect(interpolate(15, [0, 10], [0, 100], { extrapolateRight: 'identity' })).toBe(15);
  });

  it('extend extrapolation', () => {
    const result = interpolate(15, [0, 10], [0, 100], { extrapolateRight: 'extend' });
    expect(result).toBe(150);
  });

  it('throws for mismatched ranges', () => {
    expect(() => interpolate(5, [0, 10], [0])).toThrow();
  });

  it('throws for ranges with fewer than 2 elements', () => {
    expect(() => interpolate(5, [0], [0])).toThrow();
  });
});
