import { describe, it, expect } from 'vitest';
import { calculateNextFrame } from '../playback/calculate-next-frame.js';

describe('calculateNextFrame', () => {
  const base = {
    currentFrame: 0,
    durationInFrames: 90,
    fps: 30,
    playbackRate: 1,
    loop: false,
  };

  it('returns frame 0 at startTime', () => {
    const result = calculateNextFrame({ ...base, startTime: 1000, now: 1000 });
    expect(result.frame).toBe(0);
    expect(result.ended).toBe(false);
  });

  it('advances frames based on elapsed time', () => {
    // 1 second at 30fps = frame 30
    const result = calculateNextFrame({ ...base, startTime: 0, now: 1000 });
    expect(result.frame).toBe(30);
  });

  it('clamps at end when not looping', () => {
    const result = calculateNextFrame({ ...base, startTime: 0, now: 10000 });
    expect(result.frame).toBe(89); // durationInFrames - 1
    expect(result.ended).toBe(true);
  });

  it('loops when loop is true', () => {
    const result = calculateNextFrame({ ...base, loop: true, startTime: 0, now: 4000 });
    // 4s * 30fps = 120 frames, 120 % 90 = 30
    expect(result.frame).toBe(30);
    expect(result.ended).toBe(false);
  });

  it('respects playbackRate', () => {
    const result = calculateNextFrame({ ...base, playbackRate: 2, startTime: 0, now: 500 });
    // 0.5s * 30fps * 2x = 30
    expect(result.frame).toBe(30);
  });
});
