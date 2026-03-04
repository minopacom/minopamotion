import { interpolate } from './interpolate.js';

function parseColor(color: string): [number, number, number, number] {
  // Hex
  const hex = color.replace('#', '');
  if (hex.length === 6 || hex.length === 8) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
    return [r, g, b, a];
  }

  // rgb/rgba
  const rgbMatch = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/);
  if (rgbMatch) {
    return [
      parseInt(rgbMatch[1]),
      parseInt(rgbMatch[2]),
      parseInt(rgbMatch[3]),
      rgbMatch[4] ? parseFloat(rgbMatch[4]) : 1,
    ];
  }

  throw new Error(`Cannot parse color: ${color}`);
}

function toRgba(r: number, g: number, b: number, a: number): string {
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`;
}

export function interpolateColors(
  input: number,
  inputRange: readonly number[],
  outputColors: readonly string[],
): string {
  const parsed = outputColors.map(parseColor);

  const r = interpolate(
    input,
    inputRange,
    parsed.map((c) => c[0]),
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const g = interpolate(
    input,
    inputRange,
    parsed.map((c) => c[1]),
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const b = interpolate(
    input,
    inputRange,
    parsed.map((c) => c[2]),
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const a = interpolate(
    input,
    inputRange,
    parsed.map((c) => c[3]),
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return toRgba(r, g, b, a);
}
