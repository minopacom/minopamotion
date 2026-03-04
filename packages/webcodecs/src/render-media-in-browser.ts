import type { RenderMediaInBrowserOptions } from './types.js';
import { VideoEncoderWrapper } from './video-encoder-wrapper.js';
import { captureFrame } from './frame-capturer.js';
import { createMuxer } from './mux.js';

const CODEC_MAP: Record<string, string> = {
  vp8: 'vp8',
  vp9: 'vp09.00.10.08',
};

/**
 * Renders a composition to a video Blob entirely in the browser using
 * the WebCodecs API and webm-muxer.
 *
 * Requires a browser with WebCodecs support (Chrome 94+, Edge 94+).
 *
 * @param element - The DOM element containing the rendered composition
 * @param options - Render configuration
 * @returns A Blob containing the encoded WebM video
 */
export async function renderMediaInBrowser(
  element: HTMLElement,
  options: RenderMediaInBrowserOptions,
): Promise<Blob> {
  const {
    fps,
    width,
    height,
    durationInFrames,
    codec = 'vp8',
    bitrate = 5_000_000,
    onFrameRendered,
  } = options;

  const codecString = CODEC_MAP[codec] ?? 'vp8';
  const frameDurationUs = Math.round(1_000_000 / fps);

  const encoder = new VideoEncoderWrapper({
    codec: codecString,
    width,
    height,
    bitrate,
    framerate: fps,
  });

  const muxer = createMuxer({ width, height, fps, codec });

  try {
    for (let frame = 0; frame < durationInFrames; frame++) {
      const timestamp = frame * frameDurationUs;
      const isKeyFrame = frame % (fps * 2) === 0; // Keyframe every 2 seconds

      const videoFrame = await captureFrame({ element, width, height }, timestamp);
      encoder.encode(videoFrame, isKeyFrame);

      onFrameRendered?.(frame, durationInFrames);
    }

    const chunks = await encoder.flush();
    for (const chunk of chunks) {
      muxer.addChunk(chunk);
    }

    return muxer.finalize();
  } finally {
    encoder.close();
  }
}
