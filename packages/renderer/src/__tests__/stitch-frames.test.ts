import { describe, it, expect } from 'vitest';
import { buildFfmpegArgs } from '../stitch-frames-to-video.js';

describe('buildFfmpegArgs', () => {
  it('builds h264 args with default settings', () => {
    const args = buildFfmpegArgs({
      framesDir: '/tmp/frames',
      outputLocation: '/tmp/output.mp4',
      fps: 30,
    });

    expect(args).toContain('-framerate');
    expect(args).toContain('30');
    expect(args).toContain('-c:v');
    expect(args).toContain('libx264');
    expect(args).toContain('/tmp/output.mp4');
    expect(args[0]).toBe('-y');
  });

  it('uses correct codec args for vp9', () => {
    const args = buildFfmpegArgs({
      framesDir: '/tmp/frames',
      outputLocation: '/tmp/output.webm',
      fps: 24,
      codec: 'vp9',
    });

    expect(args).toContain('libvpx-vp9');
    expect(args).not.toContain('libx264');
  });

  it('uses correct input pattern for jpeg format', () => {
    const args = buildFfmpegArgs({
      framesDir: '/tmp/frames',
      outputLocation: '/tmp/output.mp4',
      fps: 30,
      imageFormat: 'jpeg',
    });

    expect(args).toContain('/tmp/frames/frame-%05d.jpeg');
  });

  it('sets output framerate', () => {
    const args = buildFfmpegArgs({
      framesDir: '/tmp/frames',
      outputLocation: '/tmp/out.mp4',
      fps: 60,
    });

    const rIndex = args.indexOf('-r');
    expect(rIndex).toBeGreaterThan(-1);
    expect(args[rIndex + 1]).toBe('60');
  });
});
