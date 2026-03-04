import React, { useRef, useEffect, useState } from 'react';

interface AudioWaveformProps {
	src: string;
	width: number;
	height: number;
	startFrom: number; // Frame offset
	durationInFrames: number;
	fps: number;
	color?: string;
}

/**
 * Generates and displays an audio waveform visualization.
 * Extracts audio data using Web Audio API and renders as a waveform.
 */
export function AudioWaveform({
	src,
	width,
	height,
	startFrom,
	durationInFrames,
	fps,
	color = 'rgba(255, 255, 255, 0.6)',
}: AudioWaveformProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [waveformData, setWaveformData] = useState<number[] | null>(null);

	useEffect(() => {
		let cancelled = false;

		const generateWaveform = async () => {
			try {
				// Fetch audio file
				const response = await fetch(src);
				const arrayBuffer = await response.arrayBuffer();

				// Create audio context
				const audioContext = new (window.AudioContext ||
					(window as any).webkitAudioContext)();
				const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

				// Calculate the time range we need
				const startTime = startFrom / fps;
				const duration = durationInFrames / fps;
				const endTime = Math.min(
					startTime + duration,
					audioBuffer.duration,
				);

				// Get channel data (use first channel, or mix if stereo)
				const channelData = audioBuffer.getChannelData(0);
				const sampleRate = audioBuffer.sampleRate;

				// Calculate samples to extract
				const startSample = Math.floor(startTime * sampleRate);
				const endSample = Math.floor(endTime * sampleRate);
				const totalSamples = endSample - startSample;

				// Number of data points to generate (one per pixel)
				const dataPoints = Math.min(width, totalSamples);
				const samplesPerPoint = totalSamples / dataPoints;

				// Extract waveform data
				const data: number[] = [];
				for (let i = 0; i < dataPoints; i++) {
					const start = Math.floor(startSample + i * samplesPerPoint);
					const end = Math.floor(start + samplesPerPoint);

					// Find the max amplitude in this sample range
					let max = 0;
					for (let j = start; j < end && j < channelData.length; j++) {
						const abs = Math.abs(channelData[j]);
						if (abs > max) max = abs;
					}

					data.push(max);
				}

				if (!cancelled) {
					setWaveformData(data);
				}

				audioContext.close();
			} catch (error) {
				console.error('Error generating waveform:', error);
			}
		};

		generateWaveform();

		return () => {
			cancelled = true;
		};
	}, [src, startFrom, durationInFrames, fps, width]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas || !waveformData) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Clear canvas
		ctx.clearRect(0, 0, width, height);

		// Draw waveform
		ctx.fillStyle = color;
		ctx.beginPath();

		const barWidth = width / waveformData.length;
		const centerY = height / 2;

		waveformData.forEach((amplitude, i) => {
			const x = i * barWidth;
			const barHeight = amplitude * height * 0.9; // 90% of height for padding

			// Draw vertical bar centered
			ctx.fillRect(x, centerY - barHeight / 2, barWidth, barHeight);
		});
	}, [waveformData, width, height, color]);

	return (
		<canvas
			ref={canvasRef}
			width={width}
			height={height}
			style={{
				width: '100%',
				height: '100%',
				display: 'block',
			}}
		/>
	);
}
