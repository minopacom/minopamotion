export interface CalculateNextFrameOptions {
  currentFrame: number;
  durationInFrames: number;
  fps: number;
  playbackRate: number;
  startTime: number;
  now: number;
  loop: boolean;
}

export function calculateNextFrame({
  durationInFrames,
  fps,
  playbackRate,
  startTime,
  now,
  loop,
}: CalculateNextFrameOptions): { frame: number; ended: boolean } {
  const elapsedMs = now - startTime;
  const rawFrame = Math.floor((elapsedMs * fps * playbackRate) / 1000);

  if (rawFrame >= durationInFrames) {
    if (loop) {
      return { frame: rawFrame % durationInFrames, ended: false };
    }
    return { frame: durationInFrames - 1, ended: true };
  }

  return { frame: Math.max(0, rawFrame), ended: false };
}
