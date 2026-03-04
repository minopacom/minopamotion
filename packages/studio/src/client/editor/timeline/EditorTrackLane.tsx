import React, { useState } from 'react';
import type { EditorTrack, EditorElement } from '../types.js';
import type { StudioAction } from '../../store/types.js';
import { TimelineItem } from './TimelineItem.js';
import { colors } from '../../utils/colors.js';

interface EditorTrackLaneProps {
	track: EditorTrack;
	trackIndex: number;
	totalTracks: number;
	elements: EditorElement[];
	selectedElementIds: string[];
	pxPerFrame: number;
	fps: number;
	dispatch: React.Dispatch<StudioAction>;
	onDragMove: (e: React.PointerEvent, element: EditorElement) => void;
	onDragTrimStart: (e: React.PointerEvent, element: EditorElement) => void;
	onDragTrimEnd: (e: React.PointerEvent, element: EditorElement) => void;
}

const LANE_HEIGHT = 30;

export function EditorTrackLane({
	track,
	trackIndex,
	totalTracks,
	elements,
	selectedElementIds,
	pxPerFrame,
	fps,
	dispatch,
	onDragMove,
	onDragTrimStart,
	onDragTrimEnd,
}: EditorTrackLaneProps) {
	const [isRenaming, setIsRenaming] = useState(false);
	const [renameName, setRenameName] = useState(track.name);

	const layerNumber = totalTracks - trackIndex;

	const handleRename = () => {
		if (renameName.trim() && renameName !== track.name) {
			dispatch({
				type: 'RENAME_EDITOR_TRACK',
				trackId: track.id,
				name: renameName.trim(),
			});
			dispatch({ type: 'HISTORY_COMMIT' });
		}
		setIsRenaming(false);
	};

	return (
		<div
			style={{
				display: 'flex',
				height: LANE_HEIGHT,
				borderBottom: `1px solid ${colors.border}`,
				opacity: track.visible ? 1 : 0.4,
			}}
		>
			{/* Track header */}
			<div
				style={{
					width: 140,
					flexShrink: 0,
					display: 'flex',
					alignItems: 'center',
					gap: 4,
					padding: '0 4px',
					background: colors.bgPanel,
					borderRight: `1px solid ${colors.border}`,
					fontSize: 10,
					color: colors.textDim,
					overflow: 'hidden',
				}}
			>
				<button
					title={track.visible ? 'Hide' : 'Show'}
					onClick={() =>
						dispatch({
							type: 'TOGGLE_TRACK_VISIBILITY',
							trackId: track.id,
						})
					}
					style={{
						background: 'none',
						border: 'none',
						color: track.visible
							? colors.textDim
							: colors.textMuted,
						cursor: 'pointer',
						fontSize: 10,
						padding: 0,
					}}
				>
					{track.visible ? 'V' : 'H'}
				</button>
				<button
					title={track.locked ? 'Unlock' : 'Lock'}
					onClick={() =>
						dispatch({
							type: 'TOGGLE_TRACK_LOCK',
							trackId: track.id,
						})
					}
					style={{
						background: 'none',
						border: 'none',
						color: track.locked
							? colors.error
							: colors.textMuted,
						cursor: 'pointer',
						fontSize: 10,
						padding: 0,
					}}
				>
					{track.locked ? 'L' : 'U'}
				</button>

				{/* Layer number badge */}
				<span
					style={{
						background: colors.bgInput,
						color: colors.textDim,
						padding: '0 4px',
						borderRadius: 2,
						fontSize: 9,
						fontWeight: 600,
					}}
					title={`Layer ${layerNumber} (${trackIndex === 0 ? 'back' : trackIndex === totalTracks - 1 ? 'front' : 'middle'})`}
				>
					{layerNumber}
				</span>

				{/* Track name (editable on double-click) */}
				{isRenaming ? (
					<input
						type="text"
						value={renameName}
						onChange={(e) => setRenameName(e.target.value)}
						onBlur={handleRename}
						onKeyDown={(e) => {
							if (e.key === 'Enter') handleRename();
							if (e.key === 'Escape') {
								setRenameName(track.name);
								setIsRenaming(false);
							}
						}}
						autoFocus
						style={{
							flex: 1,
							background: colors.bgInput,
							color: colors.text,
							border: `1px solid ${colors.accent}`,
							borderRadius: 2,
							padding: '1px 4px',
							fontSize: 10,
							outline: 'none',
						}}
					/>
				) : (
					<span
						onDoubleClick={() => setIsRenaming(true)}
						style={{
							flex: 1,
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
							cursor: 'text',
						}}
						title="Double-click to rename"
					>
						{track.name}
					</span>
				)}
			</div>

			{/* Track items area */}
			<div
				style={{
					flex: 1,
					position: 'relative',
				}}
			>
				{elements.map((el) => (
					<TimelineItem
						key={el.id}
						element={el}
						pxPerFrame={pxPerFrame}
						fps={fps}
						isSelected={selectedElementIds.includes(el.id)}
						trackColorIndex={trackIndex}
						onClick={(e) => {
							e.stopPropagation();
							dispatch({
								type: 'SELECT_ELEMENTS',
								ids: [el.id],
								append: e.shiftKey,
							});
						}}
						onPointerDownMove={(e) => {
							if (!track.locked) onDragMove(e, el);
						}}
						onPointerDownTrimStart={(e) => {
							if (!track.locked) onDragTrimStart(e, el);
						}}
						onPointerDownTrimEnd={(e) => {
							if (!track.locked) onDragTrimEnd(e, el);
						}}
					/>
				))}
			</div>
		</div>
	);
}
