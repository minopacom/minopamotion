import { describe, it, expect } from 'vitest';
import { interpolate } from '../animation/interpolate.js';
import { Easing } from '../animation/easing.js';

describe('interpolate with easing', () => {
  it('easing affects midpoint: quad at midpoint = 25 instead of 50', () => {
    const result = interpolate(5, [0, 10], [0, 100], { easing: Easing.quad });
    // t = 0.5, quad(0.5) = 0.25, output = 0 + 0.25 * 100 = 25
    expect(result).toBe(25);
  });

  it('easing preserves endpoints', () => {
    expect(interpolate(0, [0, 10], [0, 100], { easing: Easing.quad })).toBe(0);
    expect(interpolate(10, [0, 10], [0, 100], { easing: Easing.quad })).toBe(100);
    expect(interpolate(0, [0, 10], [0, 100], { easing: Easing.cubic })).toBe(0);
    expect(interpolate(10, [0, 10], [0, 100], { easing: Easing.cubic })).toBe(100);
  });

  it('easing + clamp extrapolation', () => {
    const result = interpolate(-5, [0, 10], [0, 100], {
      easing: Easing.quad,
      extrapolateLeft: 'clamp',
    });
    expect(result).toBe(0);

    const result2 = interpolate(15, [0, 10], [0, 100], {
      easing: Easing.quad,
      extrapolateRight: 'clamp',
    });
    expect(result2).toBe(100);
  });
});
