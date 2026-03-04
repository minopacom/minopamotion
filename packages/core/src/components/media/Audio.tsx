import React, { useRef } from 'react';
import { useMediaPlayback } from './use-media-playback.js';

interface AudioProps {
  src: string;
  volume?: number;
  startFrom?: number;
  endAt?: number;
  playbackRate?: number;
}

export function Audio({ src, volume, startFrom, endAt, playbackRate }: AudioProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useMediaPlayback({
    mediaRef: audioRef,
    src,
    startFrom,
    endAt,
    volume,
    playbackRate,
  });

  return <audio ref={audioRef} src={src} />;
}
