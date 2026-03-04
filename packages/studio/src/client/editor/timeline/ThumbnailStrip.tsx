import React from 'react';
import { VideoThumbnail } from './VideoThumbnail.js';

interface ThumbnailStripProps {
	src: string;
	type: 'video' | 'image';
	durationInFrames: number;
	startFrom: number;
	fps: number;
	width: number;
	height: number;
}

/**
 * Renders a strip of thumbnails for video/image timeline elements.
 * For videos: generates multiple thumbnails at intervals
 * For images: repeats the same image
 */
export function ThumbnailStrip({
	src,
	type,
	durationInFrames,
	startFrom,
	fps,
	width,
	height,
}: ThumbnailStripProps) {
	// Calculate how many thumbnails we can fit
	const THUMBNAIL_WIDTH = 60; // px per thumbnail
	const thumbnailCount = Math.max(1, Math.floor(width / THUMBNAIL_WIDTH));

	if (type === 'image') {
		// For images, just repeat the same image
		return (
			<div
				style={{
					position: 'absolute',
					inset: 0,
					display: 'flex',
					overflow: 'hidden',
				}}
			>
				{Array.from({ length: thumbnailCount }).map((_, i) => (
					<div
						key={i}
						style={{
							width: THUMBNAIL_WIDTH,
							height: '100%',
							flexShrink: 0,
						}}
					>
						<img
							src={src}
							alt="Timeline preview"
							style={{
								width: '100%',
								height: '100%',
								objectFit: 'cover',
							}}
						/>
					</div>
				))}
			</div>
		);
	}

	// For videos, generate thumbnails at intervals
	const videoDurationInSeconds = durationInFrames / fps;
	const thumbnails = Array.from({ length: thumbnailCount }).map((_, i) => {
		// Calculate time offset for this thumbnail
		const progress = i / Math.max(1, thumbnailCount - 1);
		const timeInVideo = startFrom / fps + progress * videoDurationInSeconds;
		return timeInVideo;
	});

	return (
		<div
			style={{
				position: 'absolute',
				inset: 0,
				display: 'flex',
				overflow: 'hidden',
			}}
		>
			{thumbnails.map((time, i) => (
				<div
					key={i}
					style={{
						width: THUMBNAIL_WIDTH,
						height: '100%',
						flexShrink: 0,
					}}
				>
					<VideoThumbnail
						src={src}
						timeInSeconds={time}
						width={THUMBNAIL_WIDTH}
						height={height}
					/>
				</div>
			))}
		</div>
	);
}
