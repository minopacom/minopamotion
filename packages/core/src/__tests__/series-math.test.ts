import { describe, it, expect } from 'vitest';

/**
 * Tests the pure math from Series.tsx without React rendering.
 *
 * Series auto-calculates `from` offsets for child sequences:
 *   for each child: from = currentFrom + offset
 *   then: currentFrom = from + durationInFrames
 */

interface SeriesItem {
  durationInFrames: number;
  offset?: number;
}

function computeSeriesFroms(items: SeriesItem[]): number[] {
  const froms: number[] = [];
  let currentFrom = 0;

  for (const item of items) {
    const offset = item.offset ?? 0;
    const from = currentFrom + offset;
    froms.push(from);
    currentFrom = from + item.durationInFrames;
  }

  return froms;
}

describe('Series math', () => {
  it('auto-sequences end-to-end', () => {
    const froms = computeSeriesFroms([
      { durationInFrames: 30 },
      { durationInFrames: 60 },
      { durationInFrames: 30 },
    ]);
    expect(froms).toEqual([0, 30, 90]);
  });

  it('positive offset creates gap', () => {
    const froms = computeSeriesFroms([
      { durationInFrames: 30 },
      { durationInFrames: 60, offset: 10 },
    ]);
    // Second starts at 30 + 10 = 40
    expect(froms).toEqual([0, 40]);
  });

  it('negative offset creates overlap', () => {
    const froms = computeSeriesFroms([
      { durationInFrames: 30 },
      { durationInFrames: 60, offset: -10 },
    ]);
    // Second starts at 30 - 10 = 20
    expect(froms).toEqual([0, 20]);
  });

  it('single item starts at 0', () => {
    const froms = computeSeriesFroms([{ durationInFrames: 60 }]);
    expect(froms).toEqual([0]);
  });

  it('empty series returns empty', () => {
    const froms = computeSeriesFroms([]);
    expect(froms).toEqual([]);
  });
});
