export interface RenderMediaInBrowserOptions {
  compositionId: string;
  fps: number;
  width: number;
  height: number;
  durationInFrames: number;
  codec?: 'vp8' | 'vp9';
  bitrate?: number;
  onFrameRendered?: (frame: number, total: number) => void;
}

export interface FrameCaptureOptions {
  element: HTMLElement;
  width: number;
  height: number;
}

export interface VideoEncoderConfig {
  codec: string;
  width: number;
  height: number;
  bitrate: number;
  framerate: number;
}
