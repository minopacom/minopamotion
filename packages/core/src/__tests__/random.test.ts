import { describe, it, expect } from 'vitest';
import { random } from '../utils/random.js';

describe('random', () => {
  it('returns deterministic values for the same seed', () => {
    expect(random(42)).toBe(random(42));
    expect(random('hello')).toBe(random('hello'));
  });

  it('returns different values for different seeds', () => {
    expect(random(1)).not.toBe(random(2));
  });

  it('returns a number between 0 and 1', () => {
    for (let i = 0; i < 100; i++) {
      const val = random(i);
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(1);
    }
  });
});
