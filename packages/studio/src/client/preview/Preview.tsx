import React, { forwardRef, useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { Player } from '@minopamotion/player';
import type { PlayerRef } from '@minopamotion/player';
import type { TComposition } from '@minopamotion/core';
import { useStudioState, useStudioDispatch } from '../store/context.js';
import { colors } from '../utils/colors.js';
import { CanvasOverlay } from '../editor/canvas/CanvasOverlay.js';
import { CanvasZoomControls } from '../editor/canvas/CanvasZoomControls.js';
import { useCanvasZoomGestures } from '../hooks/useCanvasZoomGestures.js';

interface PreviewProps {
	composition: TComposition;
}

export const Preview = forwardRef<PlayerRef, PreviewProps>(
	function Preview({ composition }, ref) {
		const { inputProps, previewZoom, canvasZoom, canvasZoomFitToScreen, showCheckerboard, loop, playbackRate, editorMode, editorScene } =
			useStudioState();
		const dispatch = useStudioDispatch();
		const containerRef = useRef<HTMLDivElement>(null);
		const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

		// Enable canvas zoom gestures (Cmd+scroll) in editor mode
		useCanvasZoomGestures({
			enabled: editorMode,
			containerRef,
			dispatch,
		});

		useEffect(() => {
			const el = containerRef.current;
			if (!el) return;
			const obs = new ResizeObserver((entries) => {
				for (const entry of entries) {
					setContainerSize({
						width: entry.contentRect.width,
						height: entry.contentRect.height,
					});
				}
			});
			obs.observe(el);
			return () => obs.disconnect();
		}, []);

		const containerStyle: React.CSSProperties = useMemo(
			() => ({
				flex: 1,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				overflow: 'auto',
				position: 'relative' as const,
				background: showCheckerboard
					? `repeating-conic-gradient(${colors.checkerLight} 0% 25%, ${colors.checkerDark} 0% 50%) 0 0 / 20px 20px`
					: colors.bg,
			}),
			[showCheckerboard],
		);

		// In editor mode, use canvasZoom; otherwise use previewZoom
		const scale = editorMode
			? (canvasZoomFitToScreen ? undefined : canvasZoom)
			: (previewZoom === 0 ? undefined : previewZoom / 100);

		const playerStyle: React.CSSProperties = useMemo(
			() => ({
				width: scale
					? composition.width * scale
					: '100%',
				height: scale
					? composition.height * scale
					: '100%',
				maxWidth: scale ? undefined : '100%',
				maxHeight: scale ? undefined : '100%',
			}),
			[scale, composition.width, composition.height],
		);

		// Compute actual scale and offset for overlay positioning
		const computeOverlayLayout = useCallback(() => {
			if (!containerSize.width || !containerSize.height) {
				return { actualScale: 1, offsetX: 0, offsetY: 0 };
			}
			const cw = containerSize.width;
			const ch = containerSize.height;
			// Add 30% padding when fit-to-screen to leave plenty of breathing room
			// This ensures canvas is clearly visible with checkerboard around it
			const paddingFactor = scale === undefined ? 0.7 : 1.0;
			const actualScale = scale ?? (Math.min(cw / composition.width, ch / composition.height) * paddingFactor);
			const scaledW = composition.width * actualScale;
			const scaledH = composition.height * actualScale;
			return {
				actualScale,
				offsetX: (cw - scaledW) / 2,
				offsetY: (ch - scaledH) / 2,
			};
		}, [containerSize, scale, composition.width, composition.height]);

		const overlayLayout = computeOverlayLayout();

		// Use editor scene duration if in editor mode, otherwise use composition duration
		const durationInFrames = editorMode
			? editorScene.settings.durationInFrames
			: composition.durationInFrames;

		return (
			<div ref={containerRef} style={containerStyle}>
				<Player
					ref={ref}
					component={composition.component}
					inputProps={inputProps}
					durationInFrames={durationInFrames}
					compositionWidth={composition.width}
					compositionHeight={composition.height}
					fps={composition.fps}
					loop={loop}
					playbackRate={playbackRate}
					controls={false}
					clickToPlay={false}
					style={playerStyle}
				className="player-container"
				/>
				{editorMode && (
					<>
						<CanvasOverlay
							composition={composition}
							scale={overlayLayout.actualScale}
							offsetX={overlayLayout.offsetX}
							offsetY={overlayLayout.offsetY}
						/>
						<CanvasZoomControls />
					</>
				)}
				{scale && (
					<div
						style={{
							position: 'absolute',
							bottom: 8,
							right: 8,
							fontSize: 11,
							color: colors.textDim,
							background: 'rgba(0,0,0,0.6)',
							padding: '2px 6px',
							borderRadius: 3,
						}}
					>
						{composition.width}x{composition.height} @{' '}
						{previewZoom}%
					</div>
				)}
			</div>
		);
	},
);
