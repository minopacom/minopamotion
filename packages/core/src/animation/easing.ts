import type { Easing as EasingFn } from '../types/common.js';

export const Easing = {
  linear: ((t: number) => t) as EasingFn,

  ease: ((t: number) => bezier(0.25, 0.1, 0.25, 1)(t)) as EasingFn,

  quad: ((t: number) => t * t) as EasingFn,

  cubic: ((t: number) => t * t * t) as EasingFn,

  poly: (n: number): EasingFn => (t: number) => Math.pow(t, n),

  sin: ((t: number) => 1 - Math.cos((t * Math.PI) / 2)) as EasingFn,

  circle: ((t: number) => 1 - Math.sqrt(1 - t * t)) as EasingFn,

  exp: ((t: number) => Math.pow(2, 10 * (t - 1))) as EasingFn,

  elastic: (bounciness = 1): EasingFn => {
    const p = bounciness * Math.PI;
    return (t: number) => 1 - Math.pow(Math.cos((t * Math.PI) / 2), 3) * Math.cos(t * p);
  },

  back: (s = 1.70158): EasingFn => (t: number) => t * t * ((s + 1) * t - s),

  bounce: ((t: number) => {
    if (t < 1 / 2.75) return 7.5625 * t * t;
    if (t < 2 / 2.75) { const t2 = t - 1.5 / 2.75; return 7.5625 * t2 * t2 + 0.75; }
    if (t < 2.5 / 2.75) { const t2 = t - 2.25 / 2.75; return 7.5625 * t2 * t2 + 0.9375; }
    const t2 = t - 2.625 / 2.75;
    return 7.5625 * t2 * t2 + 0.984375;
  }) as EasingFn,

  bezier: (x1: number, y1: number, x2: number, y2: number): EasingFn => bezier(x1, y1, x2, y2),

  in: (easing: EasingFn): EasingFn => easing,
  out: (easing: EasingFn): EasingFn => (t: number) => 1 - easing(1 - t),
  inOut: (easing: EasingFn): EasingFn => (t: number) =>
    t < 0.5 ? easing(t * 2) / 2 : 1 - easing((1 - t) * 2) / 2,
};

function bezier(x1: number, y1: number, x2: number, y2: number): EasingFn {
  const NEWTON_ITERATIONS = 4;
  const NEWTON_MIN_SLOPE = 0.001;
  const SUBDIVISION_PRECISION = 0.0000001;
  const SUBDIVISION_MAX_ITERATIONS = 10;
  const kSplineTableSize = 11;
  const kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

  function A(a1: number, a2: number) { return 1.0 - 3.0 * a2 + 3.0 * a1; }
  function B(a1: number, a2: number) { return 3.0 * a2 - 6.0 * a1; }
  function C(a1: number) { return 3.0 * a1; }
  function calcBezier(t: number, a1: number, a2: number) { return ((A(a1, a2) * t + B(a1, a2)) * t + C(a1)) * t; }
  function getSlope(t: number, a1: number, a2: number) { return 3.0 * A(a1, a2) * t * t + 2.0 * B(a1, a2) * t + C(a1); }

  const sampleValues = new Float32Array(kSplineTableSize);
  for (let i = 0; i < kSplineTableSize; ++i) {
    sampleValues[i] = calcBezier(i * kSampleStepSize, x1, x2);
  }

  function binarySubdivide(x: number, a: number, b: number) {
    let currentX: number;
    let currentT: number;
    let i = 0;
    do {
      currentT = a + (b - a) / 2.0;
      currentX = calcBezier(currentT, x1, x2) - x;
      if (currentX > 0.0) b = currentT; else a = currentT;
    } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
    return currentT;
  }

  function newtonRaphsonIterate(x: number, guessT: number) {
    for (let i = 0; i < NEWTON_ITERATIONS; ++i) {
      const slope = getSlope(guessT, x1, x2);
      if (slope === 0.0) return guessT;
      const currentX = calcBezier(guessT, x1, x2) - x;
      guessT -= currentX / slope;
    }
    return guessT;
  }

  function getTForX(x: number) {
    let intervalStart = 0.0;
    let currentSample = 1;
    const lastSample = kSplineTableSize - 1;

    for (; currentSample !== lastSample && sampleValues[currentSample] <= x; ++currentSample) {
      intervalStart += kSampleStepSize;
    }
    --currentSample;

    const dist = (x - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
    const guessForT = intervalStart + dist * kSampleStepSize;
    const initialSlope = getSlope(guessForT, x1, x2);

    if (initialSlope >= NEWTON_MIN_SLOPE) return newtonRaphsonIterate(x, guessForT);
    if (initialSlope === 0.0) return guessForT;
    return binarySubdivide(x, intervalStart, intervalStart + kSampleStepSize);
  }

  return (t: number) => {
    if (t === 0 || t === 1) return t;
    return calcBezier(getTForX(t), y1, y2);
  };
}
