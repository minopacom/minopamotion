export function random(seed: number | string): number {
  let s: number;
  if (typeof seed === 'string') {
    s = 0;
    for (let i = 0; i < seed.length; i++) {
      s = ((s << 5) - s + seed.charCodeAt(i)) | 0;
    }
  } else {
    s = seed;
  }

  // Simple mulberry32 PRNG
  s = (s + 0x6d2b79f5) | 0;
  let t = Math.imul(s ^ (s >>> 15), 1 | s);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
