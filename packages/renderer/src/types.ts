export interface RenderMediaOptions {
  entry: string;
  compositionId: string;
  outputLocation: string;
  codec?: 'h264' | 'h265' | 'vp8' | 'vp9';
  imageFormat?: 'png' | 'jpeg';
  fps?: number;
  width?: number;
  height?: number;
  durationInFrames?: number;
  concurrency?: number;
  onProgress?: (progress: RenderProgress) => void;
}

export interface RenderFramesOptions {
  serveUrl: string;
  compositionId: string;
  outputDir: string;
  imageFormat?: 'png' | 'jpeg';
  fps?: number;
  durationInFrames: number;
  width?: number;
  height?: number;
  concurrency?: number;
  onFrameRendered?: (frame: number, total: number) => void;
}

export interface StitchOptions {
  framesDir: string;
  outputLocation: string;
  fps: number;
  codec?: 'h264' | 'h265' | 'vp8' | 'vp9';
  imageFormat?: 'png' | 'jpeg';
  width?: number;
  height?: number;
}

export interface RenderProgress {
  renderedFrames: number;
  totalFrames: number;
  stitchProgress: number;
}

export interface BundleOptions {
  entry: string;
  outputDir: string;
}
