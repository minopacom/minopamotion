import { describe, it, expect } from 'vitest';

/**
 * Tests the pure math from Freeze.tsx and Loop.tsx without React rendering.
 *
 * Freeze: always returns the frozen frame value
 * Loop: effectiveFrame = frame >= totalDuration ? durationInFrames - 1 : frame % durationInFrames
 */

function freezeFrame(frozenFrame: number) {
  return frozenFrame;
}

function loopFrame(
  timelineFrame: number,
  durationInFrames: number,
  times: number = Infinity,
) {
  const totalDuration = durationInFrames * times;
  if (timelineFrame >= totalDuration) {
    return durationInFrames - 1;
  }
  return timelineFrame % durationInFrames;
}

describe('Freeze math', () => {
  it('always returns the frozen frame', () => {
    expect(freezeFrame(10)).toBe(10);
    expect(freezeFrame(0)).toBe(0);
    expect(freezeFrame(99)).toBe(99);
  });
});

describe('Loop math', () => {
  it('wraps frame with modulo', () => {
    expect(loopFrame(0, 30)).toBe(0);
    expect(loopFrame(15, 30)).toBe(15);
    expect(loopFrame(30, 30)).toBe(0);
    expect(loopFrame(31, 30)).toBe(1);
    expect(loopFrame(59, 30)).toBe(29);
    expect(loopFrame(60, 30)).toBe(0);
  });

  it('clamps to durationInFrames - 1 when finite times exceeded', () => {
    // 30 frames * 2 times = 60 total
    expect(loopFrame(60, 30, 2)).toBe(29);
    expect(loopFrame(100, 30, 2)).toBe(29);
  });

  it('within finite times loops normally', () => {
    expect(loopFrame(0, 30, 2)).toBe(0);
    expect(loopFrame(30, 30, 2)).toBe(0);
    expect(loopFrame(45, 30, 2)).toBe(15);
    expect(loopFrame(59, 30, 2)).toBe(29);
  });

  it('times=1 means no looping', () => {
    expect(loopFrame(0, 30, 1)).toBe(0);
    expect(loopFrame(29, 30, 1)).toBe(29);
    // At frame 30, exceeded totalDuration (30*1=30)
    expect(loopFrame(30, 30, 1)).toBe(29);
  });
});
