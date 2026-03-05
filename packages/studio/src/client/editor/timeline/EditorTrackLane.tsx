import React, { useState } from 'react';
import type { EditorTrack, EditorElement, TimelineTransitionItem } from '../types.js';
import type { StudioAction } from '../../store/types.js';
import { TimelineItem } from './TimelineItem.js';
import { TimelineTransitionItem as TransitionItemComponent } from './TimelineTransitionItem.js';
import { useTransitionDrag } from './useTransitionDrag.js';
import { colors } from '../../utils/colors.js';
import { generateId } from '../id.js';

interface EditorTrackLaneProps {
	track: EditorTrack;
	trackIndex: number;
	totalTracks: number;
	elements: EditorElement[];
	selectedElementIds: string[];
	transitions: TimelineTransitionItem[];
	selectedTransitionIds: string[];
	pxPerFrame: number;
	fps: number;
	dispatch: React.Dispatch<StudioAction>;
	onDragMove: (e: React.PointerEvent, element: EditorElement) => void;
	onDragTrimStart: (e: React.PointerEvent, element: EditorElement) => void;
	onDragTrimEnd: (e: React.PointerEvent, element: EditorElement) => void;
}

const LANE_HEIGHT = 60; // Increased from 30 for better visibility and usability

export function EditorTrackLane({
	track,
	trackIndex,
	totalTracks,
	elements,
	selectedElementIds,
	transitions,
	selectedTransitionIds,
	pxPerFrame,
	fps,
	dispatch,
	onDragMove,
	onDragTrimStart,
	onDragTrimEnd,
}: EditorTrackLaneProps) {
	const [isRenaming, setIsRenaming] = useState(false);
	const [renameName, setRenameName] = useState(track.name);
	const { startDrag: startTransitionDrag } = useTransitionDrag(dispatch);

	const layerNumber = totalTracks - trackIndex;

	// Function to add a transition between two elements
	const addTransitionBetween = (beforeEl: EditorElement, afterEl: EditorElement) => {
		const transitionStart = beforeEl.from + beforeEl.durationInFrames - 15; // 15 frame overlap
		const transitionId = generateId();

		dispatch({
			type: 'ADD_TIMELINE_TRANSITION',
			transition: {
				id: transitionId,
				trackId: track.id,
				from: transitionStart,
				durationInFrames: 30, // 1 second at 30fps
				effect: 'crossfade',
				beforeElementId: beforeEl.id,
				afterElementId: afterEl.id,
			},
		});
		dispatch({ type: 'HISTORY_COMMIT' });
	};

	// Handle dropping transitions from the toolbar
	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		const transitionEffect = e.dataTransfer.getData('application/transition') as TimelineTransitionEffect | '';

		if (!transitionEffect) return;

		// Calculate drop position
		const rect = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const frame = Math.round(x / pxPerFrame);

		// Create transition at drop location
		dispatch({
			type: 'ADD_TIMELINE_TRANSITION',
			transition: {
				id: generateId(),
				trackId: track.id,
				from: Math.max(0, frame),
				durationInFrames: 30, // Default 1 second at 30fps
				effect: transitionEffect as TimelineTransitionEffect,
			},
		});
		dispatch({ type: 'HISTORY_COMMIT' });
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = 'copy';
	};

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
					title={track.visible ? 'Hide track (H)' : 'Show track (H)'}
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
							? colors.text
							: colors.textMuted,
						cursor: 'pointer',
						fontSize: 14,
						padding: 2,
						display: 'flex',
						alignItems: 'center',
						opacity: track.visible ? 1 : 0.5,
					}}
				>
					{track.visible ? '👁️' : '🚫'}
				</button>
				<button
					title={track.muted ? 'Unmute audio (M)' : 'Mute audio (M)'}
					onClick={() =>
						dispatch({
							type: 'TOGGLE_TRACK_MUTE',
							trackId: track.id,
						})
					}
					style={{
						background: 'none',
						border: 'none',
						color: track.muted
							? colors.error
							: colors.text,
						cursor: 'pointer',
						fontSize: 14,
						padding: 2,
						display: 'flex',
						alignItems: 'center',
						opacity: track.muted ? 0.8 : 1,
					}}
				>
					{track.muted ? '🔇' : '🔊'}
				</button>
				<button
					title={track.locked ? 'Unlock track (L)' : 'Lock track (L)'}
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
							? colors.warning
							: colors.textMuted,
						cursor: 'pointer',
						fontSize: 14,
						padding: 2,
						display: 'flex',
						alignItems: 'center',
						opacity: track.locked ? 1 : 0.6,
					}}
				>
					{track.locked ? '🔒' : '🔓'}
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
				onDrop={handleDrop}
				onDragOver={handleDragOver}
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

				{/* Render transitions */}
				{transitions.map((trans) => (
					<TransitionItemComponent
						key={trans.id}
						transition={trans}
						pxPerFrame={pxPerFrame}
						isSelected={selectedTransitionIds.includes(trans.id)}
						onClick={(e) => {
							e.stopPropagation();
							dispatch({
								type: 'SELECT_ELEMENTS',
								ids: [],
							});
							// TODO: Add selection for transitions
						}}
						onPointerDownResize={(e, edge) => {
							if (!track.locked) {
								startTransitionDrag(e, trans, edge === 'left' ? 'resize-left' : 'resize-right', pxPerFrame);
							}
						}}
						onPointerDownMove={(e) => {
							if (!track.locked) {
								startTransitionDrag(e, trans, 'move', pxPerFrame);
							}
						}}
					/>
				))}

				{/* Button to add transition between consecutive clips */}
				{elements.length > 1 && elements
					.sort((a, b) => a.from - b.from)
					.slice(0, -1)
					.map((el, i) => {
						const nextEl = elements.sort((a, b) => a.from - b.from)[i + 1];
						const gap = nextEl.from - (el.from + el.durationInFrames);

						// Only show button if there's a small gap (< 60 frames)
						if (gap > 0 && gap < 60) {
							const buttonX = (el.from + el.durationInFrames + gap / 2) * pxPerFrame;
							return (
								<button
									key={`add-trans-${el.id}-${nextEl.id}`}
									style={{
										position: 'absolute',
										left: buttonX - 12,
										top: 18,
										width: 24,
										height: 24,
										borderRadius: '50%',
										background: colors.accent,
										border: `2px solid ${colors.bgPanel}`,
										color: colors.textBright,
										fontSize: 14,
										cursor: 'pointer',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
										zIndex: 100,
									}}
									onClick={() => addTransitionBetween(el, nextEl)}
									title="Add transition"
								>
									+
								</button>
							);
						}
						return null;
					})}
			</div>
		</div>
	);
}
