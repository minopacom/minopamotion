import type { FrameCaptureOptions } from './types.js';

/**
 * Captures a DOM element to a VideoFrame using OffscreenCanvas.
 * Only available in browsers that support OffscreenCanvas and html2canvas-like rendering.
 */
export async function captureFrame(
  options: FrameCaptureOptions,
  timestamp: number,
): Promise<VideoFrame> {
  const { element, width, height } = options;

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2d context from OffscreenCanvas');
  }

  // Use the element's rendered content via a temporary canvas
  // In production, this would use a more sophisticated capture method
  const svgData = new XMLSerializer().serializeToString(element);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    });
    ctx.drawImage(img, 0, 0, width, height);
  } finally {
    URL.revokeObjectURL(url);
  }

  return new VideoFrame(canvas, { timestamp });
}
