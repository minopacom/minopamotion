import { createContext } from 'react';
import type { VideoConfig } from '../types/composition.js';

export const VideoConfigContext = createContext<VideoConfig | null>(null);
