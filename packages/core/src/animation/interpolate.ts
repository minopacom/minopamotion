import type { Easing, ExtrapolateType } from '../types/common.js';

interface InterpolateOptions {
  easing?: Easing;
  extrapolateLeft?: ExtrapolateType;
  extrapolateRight?: ExtrapolateType;
}

export function interpolate(
  input: number,
  inputRange: readonly number[],
  outputRange: readonly number[],
  options: InterpolateOptions = {},
): number {
  if (inputRange.length !== outputRange.length) {
    throw new Error(
      `inputRange (${inputRange.length}) and outputRange (${outputRange.length}) must have the same length`,
    );
  }
  if (inputRange.length < 2) {
    throw new Error('inputRange and outputRange must have at least 2 elements');
  }

  const { easing = (t: number) => t, extrapolateLeft = 'extend', extrapolateRight = 'extend' } = options;

  // Find the segment
  let segmentIndex = 0;
  for (let i = 1; i < inputRange.length; i++) {
    if (inputRange[i] >= input || i === inputRange.length - 1) {
      segmentIndex = i - 1;
      break;
    }
  }

  const inputMin = inputRange[segmentIndex];
  const inputMax = inputRange[segmentIndex + 1];
  const outputMin = outputRange[segmentIndex];
  const outputMax = outputRange[segmentIndex + 1];

  // Normalize input to 0-1
  let t = (input - inputMin) / (inputMax - inputMin);

  // Handle extrapolation
  if (input < inputRange[0]) {
    if (extrapolateLeft === 'clamp') return outputRange[0];
    if (extrapolateLeft === 'identity') return input;
    // 'extend': continue with the first segment
    t = (input - inputRange[0]) / (inputRange[1] - inputRange[0]);
    return outputRange[0] + easing(t) * (outputRange[1] - outputRange[0]);
  }

  if (input > inputRange[inputRange.length - 1]) {
    if (extrapolateRight === 'clamp') return outputRange[outputRange.length - 1];
    if (extrapolateRight === 'identity') return input;
    // 'extend': continue with the last segment
    const lastIdx = inputRange.length - 1;
    t = (input - inputRange[lastIdx - 1]) / (inputRange[lastIdx] - inputRange[lastIdx - 1]);
    return outputRange[lastIdx - 1] + easing(t) * (outputRange[lastIdx] - outputRange[lastIdx - 1]);
  }

  // Normal interpolation
  return outputMin + easing(t) * (outputMax - outputMin);
}
