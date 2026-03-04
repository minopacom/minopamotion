import React, { useRef, type CSSProperties } from 'react';
import { useMediaPlayback } from './use-media-playback.js';

interface VideoProps {
  src: string;
  volume?: number;
  startFrom?: number;
  endAt?: number;
  playbackRate?: number;
  style?: CSSProperties;
  className?: string;
  muted?: boolean;
}

export function Video({
  src,
  volume,
  startFrom,
  endAt,
  playbackRate,
  style,
  className,
  muted,
}: VideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useMediaPlayback({
    mediaRef: videoRef,
    src,
    startFrom,
    endAt,
    volume: muted ? 0 : volume,
    playbackRate,
  });

  return <video ref={videoRef} src={src} style={style} className={className} muted={muted} />;
}
