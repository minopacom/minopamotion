import type { VideoEncoderConfig } from './types.js';

/**
 * Wraps the WebCodecs VideoEncoder API for encoding video frames.
 * Only available in browsers that support the WebCodecs API.
 */
export class VideoEncoderWrapper {
  private encoder: VideoEncoder;
  private encodedChunks: EncodedVideoChunk[] = [];
  private frameCount = 0;

  constructor(config: VideoEncoderConfig) {
    this.encoder = new VideoEncoder({
      output: (chunk) => {
        this.encodedChunks.push(chunk);
      },
      error: (err) => {
        throw new Error(`VideoEncoder error: ${err.message}`);
      },
    });

    this.encoder.configure({
      codec: config.codec,
      width: config.width,
      height: config.height,
      bitrate: config.bitrate,
      framerate: config.framerate,
    });
  }

  encode(frame: VideoFrame, keyFrame = false): void {
    this.encoder.encode(frame, { keyFrame });
    frame.close();
    this.frameCount++;
  }

  async flush(): Promise<EncodedVideoChunk[]> {
    await this.encoder.flush();
    return this.encodedChunks;
  }

  close(): void {
    this.encoder.close();
  }

  getFrameCount(): number {
    return this.frameCount;
  }
}
