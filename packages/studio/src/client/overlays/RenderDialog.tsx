import React, { useState } from 'react';
import type { PlayerRef } from '@minopamotion/player';
import { useStudioState, useStudioDispatch } from '../store/context.js';
import { colors } from '../utils/colors.js';

const CODECS = ['vp8', 'vp9'] as const;

interface RenderDialogProps {
	playerRef: React.RefObject<PlayerRef | null>;
}

export function RenderDialog({ playerRef }: RenderDialogProps) {
	const state = useStudioState();
	const dispatch = useStudioDispatch();
	const [codec, setCodec] = useState<'vp8' | 'vp9'>('vp8');
	const [bitrate, setBitrate] = useState(5);
	const [isRendering, setIsRendering] = useState(false);
	const [progress, setProgress] = useState({ current: 0, total: 0 });
	const [error, setError] = useState<string | null>(null);

	const comp = state.compositions.find(
		(c) => c.id === state.selectedCompositionId,
	);

	const close = () => {
		if (!isRendering) {
			dispatch({ type: 'SHOW_RENDER_DIALOG', show: false });
		}
	};

	const downloadBlob = (blob: Blob, filename: string) => {
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	const renderVideo = async () => {
		if (!comp || !playerRef.current || isRendering) return;

		// Use editor scene duration if in editor mode, otherwise use composition duration
		const durationInFrames = state.editorMode
			? state.editorScene.settings.durationInFrames
			: comp.durationInFrames;

		setIsRendering(true);
		setProgress({ current: 0, total: durationInFrames });
		setError(null);

		try {
			if (typeof VideoEncoder === 'undefined') {
				throw new Error(
					'WebCodecs is not supported. Please use Chrome 94+ or Edge 94+.',
				);
			}

			const player = playerRef.current;

			// Import html2canvas to capture DOM
			const html2canvas = (await import('html2canvas')).default;

			// Find the player container in the DOM
			const container = document.querySelector('.player-container') as HTMLElement;
			if (!container) {
				throw new Error(
					'Could not find player container. Please try again.',
				);
			}

			console.log('[Render] Starting render...', {
				width: comp.width,
				height: comp.height,
				fps: comp.fps,
				durationInFrames: durationInFrames,
				codec,
				bitrate: bitrate * 1_000_000,
			});

			// Check if there are audio elements
			const hasAudio = state.editorScene.tracks.some((track) =>
				track.elements?.some((el) => el.type === 'audio' || el.type === 'video'),
			);

			if (hasAudio) {
				console.warn('[Render] Audio elements detected but audio encoding is not yet supported. Video will render without audio.');
			}

			const wasPlaying = player.isPlaying();
			if (wasPlaying) {
				player.pause();
			}

			// Store original player styles and force it to full composition size
			// This ensures html2canvas captures at the correct resolution
			const originalWidth = container.style.width;
			const originalHeight = container.style.height;
			const originalTransform = container.style.transform;
			const originalPosition = container.style.position;
			const originalLeft = container.style.left;
			const originalTop = container.style.top;

			container.style.width = `${comp.width}px`;
			container.style.height = `${comp.height}px`;
			container.style.transform = 'none';
			container.style.position = 'fixed';
			container.style.left = '-9999px'; // Move off-screen during render
			container.style.top = '0';

			const codecString = codec === 'vp9' ? 'vp09.00.10.08' : 'vp8';

			const { Muxer, ArrayBufferTarget } = await import('webm-muxer');
			const target = new ArrayBufferTarget();
			const muxer = new Muxer({
				target,
				video: {
					codec: codec === 'vp9' ? 'V_VP9' : 'V_VP8',
					width: comp.width,
					height: comp.height,
					frameRate: comp.fps,
				},
			});

			const encoder = new VideoEncoder({
				output: (chunk) => {
					muxer.addVideoChunk(chunk);
				},
				error: (e) => {
					console.error('[Render] Encoder error:', e);
					setError(e.message);
				},
			});

			encoder.configure({
				codec: codecString,
				width: comp.width,
				height: comp.height,
				bitrate: bitrate * 1_000_000,
				framerate: comp.fps,
			});

			const frameDurationUs = Math.round(1_000_000 / comp.fps);

			for (let frame = 0; frame < durationInFrames; frame++) {
				player.seekTo(frame);

				await new Promise((resolve) => requestAnimationFrame(resolve));
				await new Promise((resolve) => requestAnimationFrame(resolve));

				// Capture the DOM element as canvas
				const canvas = await html2canvas(container, {
					width: comp.width,
					height: comp.height,
					scale: 1,
					backgroundColor: '#000000',
					logging: false,
					useCORS: true,
					allowTaint: true,
				});

				// Convert canvas to VideoFrame using createImageBitmap
				const timestamp = frame * frameDurationUs;

				// Create ImageBitmap from canvas (more reliable than ImageData)
				const bitmap = await createImageBitmap(canvas);
				const videoFrame = new VideoFrame(bitmap, {
					timestamp,
					duration: frameDurationUs,
				});
				bitmap.close();

				const isKeyFrame = frame % (comp.fps * 2) === 0;
				encoder.encode(videoFrame, { keyFrame: isKeyFrame });
				videoFrame.close();

				setProgress({ current: frame + 1, total: durationInFrames });

				if (frame % 10 === 0) {
					console.log(
						`[Render] Progress: ${frame + 1}/${durationInFrames}`,
					);
				}
			}

			await encoder.flush();
			encoder.close();

			muxer.finalize();
			const buffer = target.buffer;
			const blob = new Blob([buffer], { type: 'video/webm' });

			console.log('[Render] Complete!', {
				size: `${(blob.size / 1024 / 1024).toFixed(2)} MB`,
			});

			const filename = `${comp.id}-${Date.now()}.webm`;
			downloadBlob(blob, filename);

			// Restore original player styles
			container.style.width = originalWidth;
			container.style.height = originalHeight;
			container.style.transform = originalTransform;
			container.style.position = originalPosition;
			container.style.left = originalLeft;
			container.style.top = originalTop;

			if (wasPlaying) {
				player.play();
			}

			setTimeout(() => {
				close();
			}, 1000);
		} catch (err) {
			console.error('[Render] Error:', err);
			setError(
				err instanceof Error ? err.message : 'Unknown error occurred',
			);
		} finally {
			setIsRendering(false);
		}
	};

	const labelStyle: React.CSSProperties = {
		fontSize: 12,
		color: colors.textDim,
		marginBottom: 4,
		display: 'block',
	};

	const selectStyle: React.CSSProperties = {
		width: '100%',
		background: colors.bgInput,
		color: colors.text,
		border: `1px solid ${colors.border}`,
		borderRadius: 4,
		padding: '6px 8px',
		fontSize: 13,
		outline: 'none',
	};

	if (!state.showRenderDialog) return null;

	return (
		<div
			style={{
				position: 'fixed',
				inset: 0,
				background: colors.overlay,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				zIndex: 1000,
			}}
			onClick={close}
		>
			<div
				onClick={(e) => e.stopPropagation()}
				style={{
					background: colors.bgPanel,
					border: `1px solid ${colors.border}`,
					borderRadius: 8,
					padding: 24,
					width: 400,
				}}
			>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						marginBottom: 20,
					}}
				>
					<h2
						style={{
							margin: 0,
							fontSize: 16,
							color: colors.textBright,
							fontWeight: 600,
						}}
					>
						Render Composition
					</h2>
					<button
						onClick={close}
						disabled={isRendering}
						style={{
							background: 'none',
							border: 'none',
							color: isRendering
								? colors.textMuted
								: colors.textDim,
							fontSize: 18,
							cursor: isRendering ? 'not-allowed' : 'pointer',
						}}
					>
						×
					</button>
				</div>

				{comp && (
					<div
						style={{
							background: colors.bgInput,
							borderRadius: 4,
							padding: '8px 12px',
							marginBottom: 16,
							fontSize: 12,
							color: colors.text,
						}}
					>
						<strong>{comp.id}</strong> &mdash; {comp.width}x
						{comp.height} @ {comp.fps}fps,{' '}
						{comp.durationInFrames} frames
					</div>
				)}

				{error && (
					<div
						style={{
							background: '#ef444420',
							border: '1px solid #ef4444',
							borderRadius: 4,
							padding: '8px 12px',
							marginBottom: 16,
							fontSize: 12,
							color: '#ef4444',
						}}
					>
						{error}
					</div>
				)}

				{isRendering && (
					<div
						style={{
							marginBottom: 16,
							padding: '12px',
							background: colors.bgInput,
							borderRadius: 4,
						}}
					>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								marginBottom: 8,
								fontSize: 12,
								color: colors.text,
							}}
						>
							<span>Rendering...</span>
							<span>
								{progress.current} / {progress.total} frames
							</span>
						</div>
						<div
							style={{
								width: '100%',
								height: 4,
								background: colors.border,
								borderRadius: 2,
								overflow: 'hidden',
							}}
						>
							<div
								style={{
									width: `${(progress.current / progress.total) * 100}%`,
									height: '100%',
									background: colors.accentGradient,
									transition: 'width 0.1s ease',
								}}
							/>
						</div>
						<div
							style={{
								marginTop: 8,
								fontSize: 11,
								color: colors.textDim,
							}}
						>
							{Math.round((progress.current / progress.total) * 100)}
							% complete
						</div>
					</div>
				)}

				<div style={{ marginBottom: 12 }}>
					<label style={labelStyle}>Codec</label>
					<select
						value={codec}
						onChange={(e) =>
							setCodec(e.target.value as 'vp8' | 'vp9')
						}
						style={selectStyle}
						disabled={isRendering}
					>
						{CODECS.map((c) => (
							<option key={c} value={c}>
								{c.toUpperCase()} (WebM)
							</option>
						))}
					</select>
				</div>

				<div style={{ marginBottom: 20 }}>
					<label style={labelStyle}>Bitrate: {bitrate} Mbps</label>
					<input
						type="range"
						min={1}
						max={20}
						step={1}
						value={bitrate}
						onChange={(e) => setBitrate(Number(e.target.value))}
						disabled={isRendering}
						style={{
							width: '100%',
							accentColor: colors.accent,
						}}
					/>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							marginTop: 4,
							fontSize: 10,
							color: colors.textMuted,
						}}
					>
						<span>1 Mbps (Low)</span>
						<span>20 Mbps (High)</span>
					</div>
				</div>

				<button
					onClick={renderVideo}
					disabled={isRendering || !comp}
					style={{
						width: '100%',
						padding: '10px 16px',
						background: isRendering
							? colors.bgInput
							: colors.accentGradient,
						color: isRendering
							? colors.textMuted
							: colors.textBright,
						border: 'none',
						borderRadius: 4,
						fontSize: 13,
						cursor: isRendering ? 'not-allowed' : 'pointer',
						fontWeight: 600,
						transition: 'all 0.2s ease',
					}}
				>
					{isRendering ? 'Rendering...' : '✨ Start Render'}
				</button>

				{!isRendering && (
					<div
						style={{
							marginTop: 12,
							fontSize: 11,
							color: colors.textMuted,
							textAlign: 'center',
						}}
					>
						Requires Chrome 94+ or Edge 94+ (WebCodecs API)
					</div>
				)}
			</div>
		</div>
	);
}
