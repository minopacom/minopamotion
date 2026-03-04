import React, { useRef, useEffect } from 'react';
import { useCurrentFrame } from '@minopamotion/core';
import type { AudioElement } from './types.js';

interface AudioRendererProps {
	element: AudioElement;
	fps: number;
}

export function AudioRenderer({ element, fps }: AudioRendererProps) {
	const frame = useCurrentFrame();
	const audioRef = useRef<HTMLAudioElement>(null);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const currentTime = (frame + element.startFrom) / fps;

		if (Math.abs(audio.currentTime - currentTime) > 0.1) {
			audio.currentTime = currentTime;
		}

		audio.volume = element.volume;
	}, [frame, fps, element.startFrom, element.volume]);

	return (
		<audio
			ref={audioRef}
			src={element.src}
			style={{ display: 'none' }}
		/>
	);
}
