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
export const ThumbnailStrip = React.memo(function ThumbnailStrip({
	src,
	type,
	durationInFrames,
	startFrom,
	fps,
	width,
	height,
}: ThumbnailStripProps) {
	// Safety check: don't render if width is too small (prevents crashes)
	if (width < 10 || height < 10) {
		return null;
	}

	// Calculate how many thumbnails we can fit
	// Reduced to max 20 thumbnails to improve performance
	const THUMBNAIL_WIDTH = 80; // px per thumbnail (increased from 60)
	const maxThumbnails = 20; // Limit to prevent performance issues
	const thumbnailCount = Math.max(1, Math.min(maxThumbnails, Math.floor(width / THUMBNAIL_WIDTH)));

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
});
