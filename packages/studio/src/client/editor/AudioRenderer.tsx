import React, { useRef, useEffect } from 'react';
import { useCurrentFrame } from '@minopamotion/core';
import { useStudioState } from '../store/context.js';
import type { AudioElement } from './types.js';

interface AudioRendererProps {
	element: AudioElement;
	fps: number;
}

export function AudioRenderer({ element, fps }: AudioRendererProps) {
	const frame = useCurrentFrame();
	const audioRef = useRef<HTMLAudioElement>(null);
	const { playing, muted, volume: globalVolume } = useStudioState();

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		// Set volume (0-1 range)
		const elementVolume = element.volume ?? 1;
		audio.volume = muted ? 0 : elementVolume * globalVolume;

		const currentTime = (frame + element.startFrom) / fps;

		if (Math.abs(audio.currentTime - currentTime) > 0.1) {
			audio.currentTime = currentTime;
		}

		// Play or pause based on playing state
		if (playing) {
			audio.play().catch(() => {
				// Ignore autoplay errors
			});
		} else {
			audio.pause();
		}
	}, [frame, fps, element.startFrom, element.volume, playing, muted, globalVolume]);

	return (
		<audio
			ref={audioRef}
			src={element.src}
			style={{ display: 'none' }}
		/>
	);
}
