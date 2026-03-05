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

const btnStyle: React.CSSProperties = {
	background: 'none',
	border: 'none',
	color: colors.text,
	cursor: 'pointer',
	fontSize: 14,
	padding: '2px 6px',
	borderRadius: 3,
};

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

	// Use editor scene duration if in editor mode, otherwise use composition duration
	const durationInFrames = state.editorMode
		? state.editorScene.settings.durationInFrames
		: comp.durationInFrames;

	// Total scrollable width - only the canvas area (not including track headers)
	const TRACK_HEADER_WIDTH = 140;
	const totalWidth = (containerWidth - TRACK_HEADER_WIDTH) * state.timelineZoom + TRACK_HEADER_WIDTH;

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
			{/* Timeline header with playback controls */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 8,
					padding: '4px 8px',
					borderBottom: `1px solid ${colors.border}`,
					fontSize: 11,
					color: colors.textDim,
					background: colors.bgPanel,
				}}
			>
				{/* Playback controls */}
				<button
					style={btnStyle}
					onClick={() => {
						if (state.playing) {
							playerRef.current?.pause();
						} else {
							playerRef.current?.play();
						}
					}}
					title="Play/Pause (Space)"
				>
					{state.playing ? '⏸' : '▶'}
				</button>
				<button
					style={btnStyle}
					onClick={() => {
						dispatch({ type: 'STEP_FRAME', delta: -1 });
						playerRef.current?.seekTo(state.currentFrame - 1);
					}}
					title="Step back (Left)"
				>
					{'◀'}
				</button>
				<button
					style={btnStyle}
					onClick={() => {
						dispatch({ type: 'STEP_FRAME', delta: 1 });
						playerRef.current?.seekTo(state.currentFrame + 1);
					}}
					title="Step forward (Right)"
				>
					{'▶'}
				</button>

				<div style={{ width: 1, height: 16, background: colors.border }} />

				{/* Frame counter */}
				<span style={{ fontFamily: 'monospace', fontSize: 11 }}>
					{state.currentFrame} / {durationInFrames}
				</span>

				<div style={{ flex: 1 }} />

				{/* Snapping toggle */}
				<button
					onClick={() => dispatch({ type: 'TOGGLE_SNAPPING' })}
					style={{
						...btnStyle,
						background: state.snappingEnabled ? colors.accent : colors.bgInput,
						color: state.snappingEnabled ? colors.textBright : colors.text,
						fontWeight: state.snappingEnabled ? 600 : 400,
						padding: '2px 8px',
					}}
					title="Toggle snapping (Shift+M)"
				>
					🧲 {state.snappingEnabled ? 'On' : 'Off'}
				</button>

				{/* Ripple Edit toggle */}
				{state.editorMode && (
					<button
						onClick={() => dispatch({ type: 'TOGGLE_RIPPLE_EDIT' })}
						style={{
							...btnStyle,
							background: state.rippleEditEnabled ? colors.accent : colors.bgInput,
							color: state.rippleEditEnabled ? colors.textBright : colors.text,
							fontWeight: state.rippleEditEnabled ? 600 : 400,
							padding: '2px 8px',
						}}
						title="Toggle ripple edit (Shift+R) - Auto-close gaps when deleting"
					>
						⚡ Ripple {state.rippleEditEnabled ? 'On' : 'Off'}
					</button>
				)}

				{/* Insert Mode toggle */}
				{state.editorMode && (
					<button
						onClick={() => dispatch({ type: 'TOGGLE_INSERT_MODE' })}
						style={{
							...btnStyle,
							background: state.insertMode ? colors.accent : colors.bgInput,
							color: state.insertMode ? colors.textBright : colors.text,
							fontWeight: state.insertMode ? 600 : 400,
							padding: '2px 8px',
						}}
						title="Toggle insert mode (Shift+I) - Insert: push clips forward | Overwrite: replace clips"
					>
						{state.insertMode ? '➕ Insert' : '🔄 Overwrite'}
					</button>
				)}

				<div style={{ width: 1, height: 16, background: colors.border }} />

				{/* Zoom controls */}
				<button
					onClick={() =>
						dispatch({
							type: 'SET_TIMELINE_ZOOM',
							zoom: Math.max(0.1, state.timelineZoom - 0.25),
						})
					}
					style={btnStyle}
					title="Zoom out"
				>
					-
				</button>
				<span style={{ fontFamily: 'monospace', minWidth: 36, textAlign: 'center', fontSize: 11 }}>
					{Math.round(state.timelineZoom * 100)}%
				</span>
				<button
					onClick={() =>
						dispatch({
							type: 'SET_TIMELINE_ZOOM',
							zoom: Math.min(10, state.timelineZoom + 0.25),
						})
					}
					style={btnStyle}
					title="Zoom in"
				>
					+
				</button>
			</div>

			{/* Timeline area wrapper with relative positioning for playhead */}
			<div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
				{/* Ruler - fixed, not scrollable */}
				<Ruler
					durationInFrames={durationInFrames}
					fps={comp.fps}
					zoom={state.timelineZoom}
					scrollLeft={scrollLeft}
					width={containerWidth}
					onSeek={handleSeek}
				/>

				{/* Scrollable area */}
				<div
					ref={containerRef}
					onScroll={handleScroll}
					onWheel={handleWheel}
					style={{
						height: 'calc(100% - 24px)', // Subtract ruler height
						overflow: 'auto',
						position: 'relative',
					}}
				>
					<div style={{ width: totalWidth, minHeight: '100%', position: 'relative' }}>
						{/* Tracks + markers */}
						<div style={{ position: 'relative' }}>
						{state.editorMode ? (
							<EditorTrackArea
								durationInFrames={durationInFrames}
								zoom={state.timelineZoom}
								width={containerWidth}
								fps={comp.fps}
							/>
						) : (
							<TrackArea
								tracks={state.tracks}
								durationInFrames={durationInFrames}
								zoom={state.timelineZoom}
								scrollLeft={scrollLeft}
								width={containerWidth}
							/>
						)}
						<InOutMarkers
							inPoint={state.inPoint}
							outPoint={state.outPoint}
							durationInFrames={durationInFrames}
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

					{/* Click-to-seek on empty area */}
					{state.tracks.length === 0 && (
						<div
							onClick={(e) => {
								const rect = (
									e.currentTarget as HTMLDivElement
								).getBoundingClientRect();
								const x = e.clientX - rect.left + scrollLeft;
								const TRACK_HEADER_WIDTH = 140;
								const canvasWidth = containerWidth - TRACK_HEADER_WIDTH;
								const pxPerFrame =
									(canvasWidth * state.timelineZoom) /
									durationInFrames;
								handleSeek(
									Math.max(
										0,
										Math.min(
											durationInFrames - 1,
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

			{/* Playhead - positioned absolutely over everything */}
			<Playhead
				currentFrame={state.currentFrame}
				durationInFrames={durationInFrames}
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
		</div>
	</div>
	);
}
