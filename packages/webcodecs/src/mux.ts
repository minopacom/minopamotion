import { Muxer, ArrayBufferTarget } from 'webm-muxer';

export interface MuxOptions {
  width: number;
  height: number;
  fps: number;
  codec: string;
}

/**
 * Creates a WebM muxer that collects encoded video chunks into a final Blob.
 */
export function createMuxer(options: MuxOptions) {
  const target = new ArrayBufferTarget();

  const muxer = new Muxer({
    target,
    video: {
      codec: options.codec === 'vp9' ? 'V_VP9' : 'V_VP8',
      width: options.width,
      height: options.height,
      frameRate: options.fps,
    },
  });

  return {
    addChunk(chunk: EncodedVideoChunk) {
      muxer.addVideoChunk(chunk);
    },

    finalize(): Blob {
      muxer.finalize();
      const buffer = target.buffer;
      return new Blob([buffer], { type: 'video/webm' });
    },
  };
}
