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
export const VideoThumbnail = React.memo(function VideoThumbnail({
	src,
	timeInSeconds,
	width,
	height,
}: VideoThumbnailProps) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [thumbnail, setThumbnail] = useState<string | null>(null);
	const [error, setError] = useState(false);

	useEffect(() => {
		const video = videoRef.current;
		const canvas = canvasRef.current;
		if (!video || !canvas) return;

		let cancelled = false;

		const generateThumbnail = () => {
			if (cancelled) return;

			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			try {
				// Draw the current video frame to canvas
				canvas.width = width;
				canvas.height = height;
				ctx.drawImage(video, 0, 0, width, height);

				// Convert to data URL with lower quality for performance
				const dataUrl = canvas.toDataURL('image/jpeg', 0.5);
				if (!cancelled) {
					setThumbnail(dataUrl);
				}
			} catch (err) {
				console.error('Failed to generate thumbnail:', err);
				setError(true);
			}
		};

		const handleSeeked = () => {
			generateThumbnail();
		};

		const handleLoadedMetadata = () => {
			if (cancelled) return;
			video.currentTime = Math.min(timeInSeconds, video.duration);
		};

		const handleError = () => {
			if (!cancelled) {
				setError(true);
			}
		};

		video.addEventListener('loadedmetadata', handleLoadedMetadata);
		video.addEventListener('seeked', handleSeeked);
		video.addEventListener('error', handleError);

		return () => {
			cancelled = true;
			video.removeEventListener('loadedmetadata', handleLoadedMetadata);
			video.removeEventListener('seeked', handleSeeked);
			video.removeEventListener('error', handleError);
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
				preload="metadata"
				crossOrigin="anonymous"
			/>
			{/* Hidden canvas for drawing */}
			<canvas ref={canvasRef} style={{ display: 'none' }} />
			{/* Display thumbnail if generated, otherwise show placeholder */}
			{thumbnail ? (
				<img
					src={thumbnail}
					alt="Video thumbnail"
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
					}}
				/>
			) : !error ? (
				<div
					style={{
						width: '100%',
						height: '100%',
						background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
					}}
				/>
			) : null}
		</>
	);
});
