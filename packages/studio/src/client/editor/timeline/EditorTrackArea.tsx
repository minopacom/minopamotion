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
	const { editorScene, selectedElementIds } = useStudioState();
	const dispatch = useStudioDispatch();

	const totalWidth = width * zoom;
	const pxPerFrame = totalWidth / durationInFrames;

	const { startDrag, onPointerMove, onPointerUp } = useTimelineDrag({
		dispatch,
		pxPerFrame,
	});

	return (
		<>
			<TrackControls />
			{editorScene.tracks.length === 0 ? (
				<div
					style={{
						height: 60,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						color: colors.textMuted,
						fontSize: 11,
					}}
				>
					Click "+ Add Track" to start
				</div>
			) : (
				<div
					onPointerMove={onPointerMove}
					onPointerUp={onPointerUp}
				>
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
				</div>
			)}
		</>
	);
}
