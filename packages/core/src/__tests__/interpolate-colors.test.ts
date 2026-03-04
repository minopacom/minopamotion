import { describe, it, expect } from 'vitest';
import { interpolateColors } from '../animation/interpolate-colors.js';

describe('interpolateColors', () => {
  it('parses hex #RRGGBB colors', () => {
    const result = interpolateColors(0, [0, 1], ['#000000', '#ffffff']);
    expect(result).toBe('rgba(0, 0, 0, 1)');
  });

  it('parses hex #RRGGBBAA colors', () => {
    const result = interpolateColors(0, [0, 1], ['#ff000080', '#00ff00ff']);
    // #80 = 128 → 128/255 ≈ 0.502
    expect(result).toMatch(/^rgba\(255, 0, 0, /);
  });

  it('parses rgb() colors', () => {
    const result = interpolateColors(0, [0, 1], ['rgb(100, 200, 50)', 'rgb(200, 100, 150)']);
    expect(result).toBe('rgba(100, 200, 50, 1)');
  });

  it('parses rgba() colors', () => {
    const result = interpolateColors(0, [0, 1], ['rgba(100, 200, 50, 0.5)', 'rgba(200, 100, 150, 1)']);
    expect(result).toBe('rgba(100, 200, 50, 0.5)');
  });

  it('interpolates midpoint correctly', () => {
    const result = interpolateColors(0.5, [0, 1], ['#000000', '#ffffff']);
    // midpoint: 127.5 rounds to 128
    expect(result).toBe('rgba(128, 128, 128, 1)');
  });

  it('handles multi-segment color interpolation', () => {
    const result = interpolateColors(1, [0, 1, 2], ['#ff0000', '#00ff00', '#0000ff']);
    expect(result).toBe('rgba(0, 255, 0, 1)');
  });

  it('clamps extrapolation beyond range', () => {
    const atStart = interpolateColors(-1, [0, 1], ['#ff0000', '#0000ff']);
    const atEnd = interpolateColors(2, [0, 1], ['#ff0000', '#0000ff']);
    // Should clamp to endpoints
    expect(atStart).toBe('rgba(255, 0, 0, 1)');
    expect(atEnd).toBe('rgba(0, 0, 255, 1)');
  });

  it('interpolates alpha channel', () => {
    const result = interpolateColors(0.5, [0, 1], ['rgba(255, 0, 0, 0)', 'rgba(255, 0, 0, 1)']);
    expect(result).toBe('rgba(255, 0, 0, 0.5)');
  });

  it('throws on unparseable color', () => {
    expect(() => interpolateColors(0.5, [0, 1], ['not-a-color', '#ffffff'])).toThrow(
      'Cannot parse color',
    );
  });
});
