import { describe, it, expect } from 'vitest';

/**
 * Tests the pure math from Sequence.tsx without React rendering.
 *
 * From Sequence.tsx:
 *   cumulatedFrom = parentCumulated + parentRelative
 *   absoluteFrom = cumulatedFrom + relativeFrom
 *   currentFrame = timeline.frame - absoluteFrom
 *   Visible when: currentFrame >= 0 && currentFrame < durationInFrames
 */

function computeSequenceContext(
  parentCumulatedFrom: number,
  parentRelativeFrom: number,
  from: number,
) {
  return {
    cumulatedFrom: parentCumulatedFrom + parentRelativeFrom,
    relativeFrom: from,
  };
}

function getCurrentFrame(
  timelineFrame: number,
  cumulatedFrom: number,
  relativeFrom: number,
) {
  return timelineFrame - cumulatedFrom - relativeFrom;
}

function isVisible(currentFrame: number, durationInFrames: number) {
  return currentFrame >= 0 && currentFrame < durationInFrames;
}

describe('Sequence math', () => {
  it('root sequence visibility boundaries', () => {
    // <Sequence from={30} durationInFrames={60}>
    const ctx = computeSequenceContext(0, 0, 30);
    // absoluteFrom = 0 + 30 = 30
    expect(getCurrentFrame(29, ctx.cumulatedFrom, ctx.relativeFrom)).toBe(-1);
    expect(isVisible(-1, 60)).toBe(false);

    expect(getCurrentFrame(30, ctx.cumulatedFrom, ctx.relativeFrom)).toBe(0);
    expect(isVisible(0, 60)).toBe(true);

    expect(getCurrentFrame(89, ctx.cumulatedFrom, ctx.relativeFrom)).toBe(59);
    expect(isVisible(59, 60)).toBe(true);

    expect(getCurrentFrame(90, ctx.cumulatedFrom, ctx.relativeFrom)).toBe(60);
    expect(isVisible(60, 60)).toBe(false);
  });

  it('nested sequence: inner from=60 inside outer from=30 starts at frame 90', () => {
    // Outer: <Sequence from={30}>
    const outer = computeSequenceContext(0, 0, 30);
    // Inner: <Sequence from={60}> inside outer
    const inner = computeSequenceContext(outer.cumulatedFrom, outer.relativeFrom, 60);
    // inner.cumulatedFrom = 0 + 30 = 30
    // inner.relativeFrom = 60
    // absoluteFrom = 30 + 60 = 90
    expect(inner.cumulatedFrom).toBe(30);
    expect(inner.relativeFrom).toBe(60);

    expect(getCurrentFrame(90, inner.cumulatedFrom, inner.relativeFrom)).toBe(0);
    expect(getCurrentFrame(89, inner.cumulatedFrom, inner.relativeFrom)).toBe(-1);
  });

  it('useCurrentFrame subtraction: timeline.frame - cumulatedFrom - relativeFrom', () => {
    const ctx = computeSequenceContext(0, 0, 45);
    // At timeline frame 50, local frame = 50 - 0 - 45 = 5
    expect(getCurrentFrame(50, ctx.cumulatedFrom, ctx.relativeFrom)).toBe(5);
  });

  it('three levels of nesting', () => {
    // Level 1: <Sequence from={10}>
    const l1 = computeSequenceContext(0, 0, 10);
    // Level 2: <Sequence from={20}> inside l1
    const l2 = computeSequenceContext(l1.cumulatedFrom, l1.relativeFrom, 20);
    // Level 3: <Sequence from={5}> inside l2
    const l3 = computeSequenceContext(l2.cumulatedFrom, l2.relativeFrom, 5);

    // l1: cumulated=0, relative=10 → absolute=10
    // l2: cumulated=10, relative=20 → absolute=30
    // l3: cumulated=30, relative=5 → absolute=35
    expect(l3.cumulatedFrom).toBe(30);
    expect(l3.relativeFrom).toBe(5);

    expect(getCurrentFrame(35, l3.cumulatedFrom, l3.relativeFrom)).toBe(0);
    expect(getCurrentFrame(40, l3.cumulatedFrom, l3.relativeFrom)).toBe(5);
  });

  it('durationInFrames limits visibility', () => {
    const ctx = computeSequenceContext(0, 0, 0);
    const frame = getCurrentFrame(30, ctx.cumulatedFrom, ctx.relativeFrom);
    expect(isVisible(frame, 30)).toBe(false); // frame 30 >= duration 30
    expect(isVisible(frame - 1, 30)).toBe(true); // frame 29 < 30
  });

  it('default from=0 means no offset', () => {
    const ctx = computeSequenceContext(0, 0, 0);
    expect(ctx.cumulatedFrom).toBe(0);
    expect(ctx.relativeFrom).toBe(0);
    expect(getCurrentFrame(15, ctx.cumulatedFrom, ctx.relativeFrom)).toBe(15);
  });
});
