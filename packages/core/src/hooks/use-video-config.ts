import { useContext } from 'react';
import { VideoConfigContext } from '../contexts/video-config-context.js';
import type { VideoConfig } from '../types/composition.js';

export function useVideoConfig(): VideoConfig {
  const config = useContext(VideoConfigContext);
  if (config === null) {
    throw new Error(
      'useVideoConfig must be used inside a <Composition> or <Player>. No VideoConfigContext found.',
    );
  }
  return config;
}
