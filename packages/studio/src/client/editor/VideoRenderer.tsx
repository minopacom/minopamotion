import React, { useRef, useEffect } from 'react';
import { useCurrentFrame } from '@minopamotion/core';
import { useStudioState } from '../store/context.js';
import type { VideoElement } from './types.js';

interface VideoRendererProps {
	element: VideoElement;
	fps: number;
}

export function VideoRenderer({ element, fps }: VideoRendererProps) {
	const frame = useCurrentFrame();
	const videoRef = useRef<HTMLVideoElement>(null);
	const { playing, muted, volume: globalVolume } = useStudioState();

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		// Set volume (0-1 range)
		const elementVolume = element.volume ?? 1;
		video.volume = muted ? 0 : elementVolume * globalVolume;

		// Calculate current time based on frame and startFrom
		const currentTime = (frame + element.startFrom) / fps;

		// Seek video to current frame (with larger threshold to reduce seeking)
		if (Math.abs(video.currentTime - currentTime) > 0.1) {
			video.currentTime = currentTime;
		}

		// Play or pause based on playing state
		if (playing) {
			video.play().catch(() => {
				// Ignore autoplay errors
			});
		} else {
			video.pause();
		}
	}, [frame, fps, element.startFrom, playing, muted, globalVolume, element.volume]);

	return (
		<video
			ref={videoRef}
			src={element.src}
			style={{
				width: '100%',
				height: '100%',
				objectFit: element.objectFit,
				userSelect: 'none',
				pointerEvents: 'none',
			}}
		/>
	);
}
