import React from 'react';
import { useStudioState, useStudioDispatch } from '../../store/context.js';
import { createTextElement, createSolidElement, createEditorTrack } from '../defaults.js';
import { colors } from '../../utils/colors.js';

export function EditorToolbar() {
	const { editorMode, editorScene } = useStudioState();
	const dispatch = useStudioDispatch();

	const ensureTrack = () => {
		if (editorScene.tracks.length === 0) {
			const track = createEditorTrack({ name: 'Track 1' });
			dispatch({ type: 'ADD_EDITOR_TRACK', track });
			return track.id;
		}
		return editorScene.tracks[editorScene.tracks.length - 1].id;
	};

	const addText = () => {
		const trackId = ensureTrack();
		const element = createTextElement(trackId);
		dispatch({ type: 'ADD_ELEMENT', element });
		dispatch({ type: 'SELECT_ELEMENTS', ids: [element.id] });
		dispatch({ type: 'HISTORY_COMMIT' });
	};

	const addSolid = () => {
		const trackId = ensureTrack();
		const element = createSolidElement(trackId);
		dispatch({ type: 'ADD_ELEMENT', element });
		dispatch({ type: 'SELECT_ELEMENTS', ids: [element.id] });
		dispatch({ type: 'HISTORY_COMMIT' });
	};

	const buttonStyle: React.CSSProperties = {
		background: colors.bgInput,
		color: colors.text,
		border: `1px solid ${colors.border}`,
		borderRadius: 4,
		padding: '4px 8px',
		fontSize: 12,
		cursor: 'pointer',
	};

	const toggleStyle: React.CSSProperties = {
		...buttonStyle,
		fontWeight: 600,
		fontSize: 11,
	};

	return (
		<div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
			{/* Mode toggle */}
			<div style={{ display: 'flex', gap: 0 }}>
				{(['code', 'editor'] as const).map((mode) => {
					const isActive =
						mode === 'editor' ? editorMode : !editorMode;
					return (
						<button
							key={mode}
							onClick={() =>
								dispatch({
									type: 'SET_EDITOR_MODE',
									enabled: mode === 'editor',
								})
							}
							style={{
								...toggleStyle,
								background: isActive
									? colors.bgSelected
									: colors.bgInput,
								color: isActive
									? colors.textBright
									: colors.textDim,
								borderRadius:
									mode === 'code'
										? '4px 0 0 4px'
										: '0 4px 4px 0',
							}}
						>
							{mode === 'code' ? 'Code' : 'Editor'}
						</button>
					);
				})}
			</div>

			{editorMode && (
				<>
					<div
						style={{
							width: 1,
							height: 20,
							background: colors.border,
						}}
					/>
					<button style={buttonStyle} onClick={addText}>
						+ Text
					</button>
					<button style={buttonStyle} onClick={addSolid}>
						+ Rect
					</button>
				</>
			)}
		</div>
	);
}
