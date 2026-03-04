import React, { useRef, useEffect, useState } from 'react';

interface VideoThumbnailProps {
	src: string;
	timeInSeconds: number;
	width: number;
	height: number;
}

/**
 * Generates a thumbnail from a video at a specific time point.
 * Uses a hidden video element to seek and capture the frame.
 */
export function VideoThumbnail({
	src,
	timeInSeconds,
	width,
	height,
}: VideoThumbnailProps) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [thumbnail, setThumbnail] = useState<string | null>(null);

	useEffect(() => {
		const video = videoRef.current;
		const canvas = canvasRef.current;
		if (!video || !canvas) return;

		const generateThumbnail = () => {
			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			// Draw the current video frame to canvas
			canvas.width = width;
			canvas.height = height;
			ctx.drawImage(video, 0, 0, width, height);

			// Convert to data URL
			const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
			setThumbnail(dataUrl);
		};

		const handleSeeked = () => {
			generateThumbnail();
		};

		const handleLoadedMetadata = () => {
			video.currentTime = Math.min(timeInSeconds, video.duration);
		};

		video.addEventListener('loadedmetadata', handleLoadedMetadata);
		video.addEventListener('seeked', handleSeeked);

		return () => {
			video.removeEventListener('loadedmetadata', handleLoadedMetadata);
			video.removeEventListener('seeked', handleSeeked);
		};
	}, [src, timeInSeconds, width, height]);

	return (
		<>
			{/* Hidden video element for frame capture */}
			<video
				ref={videoRef}
				src={src}
				style={{ display: 'none' }}
				muted
				crossOrigin="anonymous"
			/>
			{/* Hidden canvas for drawing */}
			<canvas ref={canvasRef} style={{ display: 'none' }} />
			{/* Display thumbnail if generated */}
			{thumbnail && (
				<img
					src={thumbnail}
					alt="Video thumbnail"
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
					}}
				/>
			)}
		</>
	);
}
