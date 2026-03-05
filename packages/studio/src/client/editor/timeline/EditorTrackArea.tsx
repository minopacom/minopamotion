import React from 'react';
import { useStudioState, useStudioDispatch } from '../../store/context.js';
import { TrackControls } from './TrackControls.js';
import { EditorTrackLane } from './EditorTrackLane.js';
import { useTimelineDrag } from './useTimelineDrag.js';
import { colors } from '../../utils/colors.js';

interface EditorTrackAreaProps {
	durationInFrames: number;
	zoom: number;
	width: number;
	fps: number;
}

export function EditorTrackArea({
	durationInFrames,
	zoom,
	width,
	fps,
}: EditorTrackAreaProps) {
	const { editorScene, selectedElementIds, snappingEnabled, currentFrame, gridSnapInterval } =
		useStudioState();
	const dispatch = useStudioDispatch();

	const TRACK_HEADER_WIDTH = 140;
	const canvasWidth = width - TRACK_HEADER_WIDTH;
	const totalWidth = canvasWidth * zoom;
	const pxPerFrame = totalWidth / durationInFrames;

	const { startDrag, onPointerMove, onPointerUp, dragState } = useTimelineDrag({
		dispatch,
		pxPerFrame,
		snappingEnabled,
		elements: editorScene.elements,
		playheadFrame: currentFrame,
		tracks: editorScene.tracks,
		gridSnapInterval,
	});

	// Determine if we should show drop zone indicators
	const showDropZoneAbove = dragState?.needsNewTrackAbove;
	const showDropZoneBelow = dragState?.needsNewTrackBelow;

	return (
		<>
			<TrackControls />
			{editorScene.tracks.length === 0 ? (
				<div
					style={{
						height: 80,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						color: colors.textMuted,
						fontSize: 11,
						gap: 4,
					}}
				>
					<div>Drop media from the Asset Library to create tracks</div>
					<div style={{ fontSize: 10, opacity: 0.7 }}>
						Tracks are created automatically when you add media
					</div>
				</div>
			) : (
				<div
					onPointerMove={onPointerMove}
					onPointerUp={onPointerUp}
				>
					{/* Drop zone indicator above first track */}
					{showDropZoneAbove && (
						<div
							style={{
								height: 30,
								background: `${colors.accent}22`,
								border: `2px dashed ${colors.accent}`,
								borderRadius: 4,
								marginBottom: 2,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: 11,
								color: colors.accent,
								fontWeight: 600,
							}}
						>
							Drop here to create new track above
						</div>
					)}

					{editorScene.tracks.map((track, i) => {
						const trackElements = editorScene.elements.filter(
							(el) => el.trackId === track.id,
						);
						return (
							<EditorTrackLane
								key={track.id}
								track={track}
								trackIndex={i}
								totalTracks={editorScene.tracks.length}
								elements={trackElements}
								selectedElementIds={selectedElementIds}
								pxPerFrame={pxPerFrame}
								fps={fps}
								dispatch={dispatch}
								onDragMove={(e, el) =>
									startDrag(e, el, 'move')
								}
								onDragTrimStart={(e, el) =>
									startDrag(e, el, 'trim-start')
								}
								onDragTrimEnd={(e, el) =>
									startDrag(e, el, 'trim-end')
								}
							/>
						);
					})}

					{/* Drop zone indicator below last track */}
					{showDropZoneBelow && (
						<div
							style={{
								height: 30,
								background: `${colors.accent}22`,
								border: `2px dashed ${colors.accent}`,
								borderRadius: 4,
								marginTop: 2,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: 11,
								color: colors.accent,
								fontWeight: 600,
							}}
						>
							Drop here to create new track below
						</div>
					)}

					{/* Ghost preview element during drag */}
					{dragState && dragState.mode === 'move' && dragState.previewFrame !== undefined && (
						<div
							style={{
								position: 'absolute',
								left: TRACK_HEADER_WIDTH + dragState.previewFrame * pxPerFrame,
								top: dragState.previewTrackIndex !== undefined
									? Math.max(0, dragState.previewTrackIndex) * 30
									: 0,
								width: dragState.startDuration * pxPerFrame,
								height: 28,
								background: `${colors.accent}66`,
								border: `2px solid ${colors.accent}`,
								borderRadius: 4,
								pointerEvents: 'none',
								zIndex: 1000,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: 10,
								color: colors.textBright,
								fontWeight: 600,
							}}
						>
							Preview
						</div>
					)}
				</div>
			)}
		</>
	);
}
