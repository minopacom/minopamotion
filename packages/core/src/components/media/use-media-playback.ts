import { useEffect, useRef, useContext, type RefObject } from 'react';
import { TimelineContext } from '../../contexts/timeline-context.js';
import { MediaVolumeContext } from '../../contexts/media-volume-context.js';

interface UseMediaPlaybackOptions {
  mediaRef: RefObject<HTMLVideoElement | HTMLAudioElement | null>;
  src: string;
  startFrom?: number;
  endAt?: number;
  volume?: number;
  playbackRate?: number;
}

export function useMediaPlayback({
  mediaRef,
  src,
  startFrom = 0,
  endAt,
  volume: localVolume = 1,
  playbackRate: localPlaybackRate,
}: UseMediaPlaybackOptions) {
  const timeline = useContext(TimelineContext);
  const mediaVolume = useContext(MediaVolumeContext);
  const lastSeekRef = useRef<number>(-1);

  void src;

  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    const fps = 30; // TODO: get from VideoConfigContext
    const mediaTime = (timeline.frame - startFrom) / fps;

    if (endAt !== undefined && timeline.frame >= endAt) {
      media.pause();
      return;
    }

    if (timeline.frame < startFrom) {
      media.pause();
      return;
    }

    // Sync time
    if (Math.abs(media.currentTime - mediaTime) > 0.1) {
      if (lastSeekRef.current !== timeline.frame) {
        media.currentTime = mediaTime;
        lastSeekRef.current = timeline.frame;
      }
    }

    // Sync play/pause
    if (timeline.playing) {
      const playPromise = media.play();
      playPromise?.catch(() => {}); // Autoplay may be blocked
    } else {
      media.pause();
    }

    // Sync volume
    const effectiveVolume = mediaVolume.muted ? 0 : localVolume * mediaVolume.volume;
    media.volume = Math.max(0, Math.min(1, effectiveVolume));

    // Sync playback rate
    if (localPlaybackRate !== undefined) {
      media.playbackRate = localPlaybackRate;
    } else {
      media.playbackRate = timeline.playbackRate;
    }
  }, [timeline.frame, timeline.playing, timeline.playbackRate, startFrom, endAt, localVolume, localPlaybackRate, mediaRef, mediaVolume]);
}
