import React, { useRef, useState, useCallback, useEffect } from 'react';
import type { PlayerRef } from '@minopamotion/player';
import { useStudioState, useStudioDispatch } from '../store/context.js';
import { Ruler } from './Ruler.js';
import { Playhead } from './Playhead.js';
import { TrackArea } from './TrackArea.js';
import { InOutMarkers } from './InOutMarkers.js';
import { EditorTrackArea } from '../editor/timeline/EditorTrackArea.js';
import { colors } from '../utils/colors.js';

interface TimelineProps {
	playerRef: React.RefObject<PlayerRef | null>;
}

export function Timeline({ playerRef }: TimelineProps) {
	const state = useStudioState();
	const dispatch = useStudioDispatch();
	const containerRef = useRef<HTMLDivElement>(null);
	const [containerWidth, setContainerWidth] = useState(800);
	const [scrollLeft, setScrollLeft] = useState(0);

	const comp = state.compositions.find(
		(c) => c.id === state.selectedCompositionId,
	);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const obs = new ResizeObserver((entries) => {
			for (const entry of entries) {
				setContainerWidth(entry.contentRect.width);
			}
		});
		obs.observe(el);
		return () => obs.disconnect();
	}, []);

	const handleSeek = useCallback(
		(frame: number) => {
			dispatch({ type: 'SET_FRAME', frame });
			playerRef.current?.seekTo(frame);
		},
		[dispatch, playerRef],
	);

	const handleScroll = useCallback(
		(e: React.UIEvent<HTMLDivElement>) => {
			setScrollLeft((e.target as HTMLDivElement).scrollLeft);
		},
		[],
	);

	const handleWheel = useCallback(
		(e: React.WheelEvent) => {
			if (e.ctrlKey || e.metaKey) {
				e.preventDefault();
				const delta = e.deltaY > 0 ? -0.1 : 0.1;
				dispatch({
					type: 'SET_TIMELINE_ZOOM',
					zoom: state.timelineZoom + delta,
				});
			}
		},
		[dispatch, state.timelineZoom],
	);

	if (!comp) {
		return (
			<div
				style={{
					height: '100%',
					background: colors.bgLight,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					color: colors.textMuted,
					fontSize: 13,
				}}
			>
				No composition selected
			</div>
		);
	}

	const totalWidth = containerWidth * state.timelineZoom;

	return (
		<div
			style={{
				height: '100%',
				background: colors.bgLight,
				display: 'flex',
				flexDirection: 'column',
				borderTop: `1px solid ${colors.border}`,
			}}
		>
			{/* Zoom controls */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 8,
					padding: '2px 8px',
					borderBottom: `1px solid ${colors.border}`,
					fontSize: 11,
					color: colors.textDim,
				}}
			>
				<span>Timeline</span>
				<div style={{ flex: 1 }} />
				<span style={{ fontFamily: 'monospace' }}>
					{state.currentFrame} / {comp.durationInFrames}
				</span>
				<button
					onClick={() =>
						dispatch({
							type: 'SET_TIMELINE_ZOOM',
							zoom: Math.max(0.1, state.timelineZoom - 0.25),
						})
					}
					style={{
						background: 'none',
						border: 'none',
						color: colors.textDim,
						cursor: 'pointer',
						fontSize: 14,
						padding: '0 4px',
					}}
				>
					-
				</button>
				<span style={{ fontFamily: 'monospace', minWidth: 36, textAlign: 'center' }}>
					{Math.round(state.timelineZoom * 100)}%
				</span>
				<button
					onClick={() =>
						dispatch({
							type: 'SET_TIMELINE_ZOOM',
							zoom: Math.min(10, state.timelineZoom + 0.25),
						})
					}
					style={{
						background: 'none',
						border: 'none',
						color: colors.textDim,
						cursor: 'pointer',
						fontSize: 14,
						padding: '0 4px',
					}}
				>
					+
				</button>
			</div>

			{/* Scrollable area */}
			<div
				ref={containerRef}
				onScroll={handleScroll}
				onWheel={handleWheel}
				style={{
					flex: 1,
					overflow: 'auto',
					position: 'relative',
				}}
			>
				<div style={{ width: totalWidth, minHeight: '100%', position: 'relative' }}>
					{/* Ruler */}
					<Ruler
						durationInFrames={comp.durationInFrames}
						fps={comp.fps}
						zoom={state.timelineZoom}
						scrollLeft={scrollLeft}
						width={containerWidth}
						onSeek={handleSeek}
					/>

					{/* Tracks + markers */}
					<div style={{ position: 'relative' }}>
						{state.editorMode ? (
							<EditorTrackArea
								durationInFrames={comp.durationInFrames}
								zoom={state.timelineZoom}
								width={containerWidth}
								fps={comp.fps}
							/>
						) : (
							<TrackArea
								tracks={state.tracks}
								durationInFrames={comp.durationInFrames}
								zoom={state.timelineZoom}
								scrollLeft={scrollLeft}
								width={containerWidth}
							/>
						)}
						<InOutMarkers
							inPoint={state.inPoint}
							outPoint={state.outPoint}
							durationInFrames={comp.durationInFrames}
							zoom={state.timelineZoom}
							scrollLeft={scrollLeft}
							width={containerWidth}
							height={
								(state.editorMode
									? state.editorScene.tracks.length
									: state.tracks.length) *
									30 +
								8
							}
						/>
					</div>

					{/* Playhead */}
					<Playhead
						currentFrame={state.currentFrame}
						durationInFrames={comp.durationInFrames}
						zoom={state.timelineZoom}
						scrollLeft={scrollLeft}
						width={containerWidth}
						height={
							24 +
							(state.editorMode
								? state.editorScene.tracks.length
								: state.tracks.length) *
								30 +
							8
						}
						onSeek={handleSeek}
					/>

					{/* Click-to-seek on empty area */}
					{state.tracks.length === 0 && (
						<div
							onClick={(e) => {
								const rect = (
									e.currentTarget as HTMLDivElement
								).getBoundingClientRect();
								const x = e.clientX - rect.left + scrollLeft;
								const pxPerFrame =
									(containerWidth * state.timelineZoom) /
									comp.durationInFrames;
								handleSeek(
									Math.max(
										0,
										Math.min(
											comp.durationInFrames - 1,
											Math.round(x / pxPerFrame),
										),
									),
								);
							}}
							style={{
								height: 40,
								cursor: 'pointer',
							}}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
