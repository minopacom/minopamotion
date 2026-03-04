import type { StitchOptions } from './types.js';

const CODEC_ARGS: Record<string, string[]> = {
  h264: ['-c:v', 'libx264', '-pix_fmt', 'yuv420p'],
  h265: ['-c:v', 'libx265', '-pix_fmt', 'yuv420p'],
  vp8: ['-c:v', 'libvpx'],
  vp9: ['-c:v', 'libvpx-vp9'],
};

/**
 * Builds the FFmpeg command-line arguments for stitching frames into a video.
 */
export function buildFfmpegArgs(options: StitchOptions): string[] {
  const {
    framesDir,
    outputLocation,
    fps,
    codec = 'h264',
    imageFormat = 'png',
  } = options;

  const inputPattern = `${framesDir}/frame-%05d.${imageFormat}`;
  const codecArgs = CODEC_ARGS[codec] ?? CODEC_ARGS.h264;

  return [
    '-y',
    '-framerate',
    String(fps),
    '-i',
    inputPattern,
    ...codecArgs,
    '-r',
    String(fps),
    outputLocation,
  ];
}

/**
 * Stitches rendered frame images into a video using FFmpeg.
 */
export async function stitchFramesToVideo(options: StitchOptions): Promise<void> {
  const { execa } = await import('execa');
  const args = buildFfmpegArgs(options);
  await execa('ffmpeg', args);
}
