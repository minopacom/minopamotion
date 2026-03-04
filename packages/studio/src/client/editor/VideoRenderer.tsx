import React, { useRef, useEffect } from 'react';
import { useCurrentFrame } from '@minopamotion/core';
import type { VideoElement } from './types.js';

interface VideoRendererProps {
	element: VideoElement;
	fps: number;
}

export function VideoRenderer({ element, fps }: VideoRendererProps) {
	const frame = useCurrentFrame();
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		// Calculate current time based on frame and startFrom
		const currentTime = (frame + element.startFrom) / fps;

		// Seek video to current frame
		if (Math.abs(video.currentTime - currentTime) > 0.1) {
			video.currentTime = currentTime;
		}
	}, [frame, fps, element.startFrom]);

	return (
		<video
			ref={videoRef}
			src={element.src}
			muted={element.volume === 0}
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
