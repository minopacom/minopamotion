import { createContext } from 'react';

export interface MediaVolumeContextValue {
  volume: number;
  muted: boolean;
  setVolume: (v: number) => void;
  setMuted: (m: boolean) => void;
}

export const MediaVolumeContext = createContext<MediaVolumeContextValue>({
  volume: 1,
  muted: false,
  setVolume: () => {},
  setMuted: () => {},
});
