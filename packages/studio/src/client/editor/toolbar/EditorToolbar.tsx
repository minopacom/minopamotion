import React from 'react';
import { useStudioState, useStudioDispatch } from '../../store/context.js';
import { createTextElement, createSolidElement, createEditorTrack } from '../defaults.js';
import { colors } from '../../utils/colors.js';

export function EditorToolbar() {
	const { editorMode, editorScene } = useStudioState();
	const dispatch = useStudioDispatch();

	const addText = () => {
		// Create a new track for each element (matches asset library behavior)
		const trackNumber = editorScene.tracks.length + 1;
		const track = createEditorTrack({ name: `Track ${trackNumber}` });
		dispatch({ type: 'ADD_EDITOR_TRACK', track });

		const element = createTextElement(track.id);
		dispatch({ type: 'ADD_ELEMENT', element });
		dispatch({ type: 'SELECT_ELEMENTS', ids: [element.id] });
		dispatch({ type: 'HISTORY_COMMIT' });
	};

	const addSolid = () => {
		// Create a new track for each element (matches asset library behavior)
		const trackNumber = editorScene.tracks.length + 1;
		const track = createEditorTrack({ name: `Track ${trackNumber}` });
		dispatch({ type: 'ADD_EDITOR_TRACK', track });

		const element = createSolidElement(track.id);
		dispatch({ type: 'ADD_ELEMENT', element });
		dispatch({ type: 'SELECT_ELEMENTS', ids: [element.id] });
		dispatch({ type: 'HISTORY_COMMIT' });
	};

	const [hoveredButton, setHoveredButton] = React.useState<string | null>(null);

	const buttonStyle: React.CSSProperties = {
		background: colors.bgInput,
		color: colors.text,
		border: `1px solid ${colors.border}`,
		borderRadius: 6,
		padding: '6px 12px',
		fontSize: 12,
		cursor: 'pointer',
		transition: 'all 0.15s ease',
		fontWeight: 500,
	};

	const toggleStyle: React.CSSProperties = {
		background: colors.bgInput,
		color: colors.text,
		border: `1px solid ${colors.border}`,
		padding: '6px 14px',
		fontSize: 11,
		cursor: 'pointer',
		transition: 'all 0.15s ease',
		fontWeight: 600,
		letterSpacing: '0.5px',
		textTransform: 'uppercase' as const,
	};

	return (
		<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
			{/* Mode toggle */}
			<div style={{ display: 'flex', gap: 0, borderRadius: 6, overflow: 'hidden' }}>
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
								borderRadius: 0,
								borderLeft: mode === 'editor' ? 'none' : `1px solid ${colors.border}`,
								borderRight: mode === 'code' ? 'none' : `1px solid ${colors.border}`,
								borderTop: `1px solid ${colors.border}`,
								borderBottom: `1px solid ${colors.border}`,
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
							height: 24,
							background: colors.border,
						}}
					/>
					<button
						style={{
							...buttonStyle,
							background: hoveredButton === 'text' ? colors.bgHover : colors.bgInput,
							borderColor: hoveredButton === 'text' ? colors.borderLight : colors.border,
						}}
						onMouseEnter={() => setHoveredButton('text')}
						onMouseLeave={() => setHoveredButton(null)}
						onClick={addText}
					>
						✏️ Text
					</button>
					<button
						style={{
							...buttonStyle,
							background: hoveredButton === 'rect' ? colors.bgHover : colors.bgInput,
							borderColor: hoveredButton === 'rect' ? colors.borderLight : colors.border,
						}}
						onMouseEnter={() => setHoveredButton('rect')}
						onMouseLeave={() => setHoveredButton(null)}
						onClick={addSolid}
					>
						▭ Shape
					</button>
				</>
			)}
		</div>
	);
}
