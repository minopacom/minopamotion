import React, { useState } from 'react';
import { useStudioState, useStudioDispatch } from '../../store/context.js';
import { createEditorTrack } from '../defaults.js';
import { colors } from '../../utils/colors.js';

export function TrackControls() {
	const { editorScene } = useStudioState();
	const dispatch = useStudioDispatch();
	const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);

	const addTrack = () => {
		const trackNumber = editorScene.tracks.length + 1;
		const track = createEditorTrack({ name: `Track ${trackNumber}` });
		dispatch({ type: 'ADD_EDITOR_TRACK', track });
		dispatch({ type: 'HISTORY_COMMIT' });
		setSelectedTrackId(track.id);
	};

	const deleteTrack = (trackId: string) => {
		const elementsOnTrack = editorScene.elements.filter(
			(el) => el.trackId === trackId,
		);
		if (
			elementsOnTrack.length > 0 &&
			!confirm(
				`Delete track "${editorScene.tracks.find((t) => t.id === trackId)?.name}"?\n\n${elementsOnTrack.length} element(s) will be removed.`,
			)
		) {
			return;
		}
		dispatch({ type: 'REMOVE_EDITOR_TRACK', trackId });
		dispatch({ type: 'HISTORY_COMMIT' });
		if (selectedTrackId === trackId) {
			setSelectedTrackId(null);
		}
	};

	const moveTrack = (fromIndex: number, direction: 'up' | 'down') => {
		const toIndex = direction === 'up' ? fromIndex + 1 : fromIndex - 1;
		if (toIndex < 0 || toIndex >= editorScene.tracks.length) return;
		dispatch({ type: 'REORDER_TRACKS', fromIndex, toIndex });
		dispatch({ type: 'HISTORY_COMMIT' });
	};

	return (
		<div
			style={{
				background: colors.bgPanel,
				borderBottom: `1px solid ${colors.border}`,
				padding: '4px 8px',
				display: 'flex',
				gap: 8,
				alignItems: 'center',
			}}
		>
			<span
				style={{
					fontSize: 10,
					fontWeight: 600,
					color: colors.textDim,
					textTransform: 'uppercase',
					letterSpacing: 1,
				}}
			>
				Tracks ({editorScene.tracks.length})
			</span>

			<button
				onClick={addTrack}
				style={{
					background: colors.accent,
					color: colors.textBright,
					border: 'none',
					borderRadius: 3,
					padding: '2px 8px',
					fontSize: 11,
					cursor: 'pointer',
					fontWeight: 600,
				}}
			>
				+ Add Track
			</button>

			{selectedTrackId && (
				<>
					<div style={{ width: 1, height: 16, background: colors.border }} />
					<span style={{ fontSize: 11, color: colors.textDim }}>
						{
							editorScene.tracks.find((t) => t.id === selectedTrackId)
								?.name
						}
					</span>

					<button
						onClick={() => {
							const index = editorScene.tracks.findIndex(
								(t) => t.id === selectedTrackId,
							);
							moveTrack(index, 'up');
						}}
						disabled={
							editorScene.tracks.findIndex(
								(t) => t.id === selectedTrackId,
							) ===
							editorScene.tracks.length - 1
						}
						style={{
							background: colors.bgInput,
							color: colors.text,
							border: `1px solid ${colors.border}`,
							borderRadius: 3,
							padding: '2px 6px',
							fontSize: 11,
							cursor: 'pointer',
						}}
						title="Move up (to front)"
					>
						↑
					</button>

					<button
						onClick={() => {
							const index = editorScene.tracks.findIndex(
								(t) => t.id === selectedTrackId,
							);
							moveTrack(index, 'down');
						}}
						disabled={
							editorScene.tracks.findIndex(
								(t) => t.id === selectedTrackId,
							) === 0
						}
						style={{
							background: colors.bgInput,
							color: colors.text,
							border: `1px solid ${colors.border}`,
							borderRadius: 3,
							padding: '2px 6px',
							fontSize: 11,
							cursor: 'pointer',
						}}
						title="Move down (to back)"
					>
						↓
					</button>

					<button
						onClick={() => deleteTrack(selectedTrackId)}
						style={{
							background: colors.error,
							color: colors.textBright,
							border: 'none',
							borderRadius: 3,
							padding: '2px 8px',
							fontSize: 11,
							cursor: 'pointer',
						}}
					>
						Delete
					</button>
				</>
			)}

			{/* Track selection dropdown */}
			{editorScene.tracks.length > 0 && (
				<>
					<div style={{ flex: 1 }} />
					<select
						value={selectedTrackId || ''}
						onChange={(e) => setSelectedTrackId(e.target.value || null)}
						style={{
							background: colors.bgInput,
							color: colors.text,
							border: `1px solid ${colors.border}`,
							borderRadius: 3,
							padding: '2px 6px',
							fontSize: 11,
							outline: 'none',
						}}
					>
						<option value="">Select track...</option>
						{[...editorScene.tracks].reverse().map((track, i) => (
							<option key={track.id} value={track.id}>
								{track.name} (Layer {editorScene.tracks.length - i})
							</option>
						))}
					</select>
				</>
			)}
		</div>
	);
}
