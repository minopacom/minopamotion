import React from 'react';
import { useStudioState, useStudioDispatch } from '../../store/context.js';
import { SceneSettings } from './SceneSettings.js';
import { LayoutSection } from './LayoutSection.js';
import { FillSection } from './FillSection.js';
import { TextSection } from './TextSection.js';
import { SolidSection } from './SolidSection.js';
import { MediaSection } from './MediaSection.js';
import { colors } from '../../utils/colors.js';
import type {
	TextElement,
	SolidElement,
	ImageElement,
	VideoElement,
	AudioElement,
} from '../types.js';

export function ElementInspector() {
	const { editorScene, selectedElementIds } = useStudioState();
	const dispatch = useStudioDispatch();

	if (selectedElementIds.length === 0) {
		return <SceneSettings />;
	}

	if (selectedElementIds.length > 1) {
		return (
			<div
				style={{
					padding: 16,
					color: colors.textMuted,
					fontSize: 12,
					textAlign: 'center',
				}}
			>
				{selectedElementIds.length} elements selected
			</div>
		);
	}

	const element = editorScene.elements.find(
		(el) => el.id === selectedElementIds[0],
	);
	if (!element) return null;

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 12,
				padding: 8,
			}}
		>
			{/* Element name */}
			<input
				type="text"
				value={element.name}
				onChange={(e) =>
					dispatch({
						type: 'UPDATE_ELEMENT',
						id: element.id,
						updates: { name: e.target.value },
					})
				}
				onBlur={() => dispatch({ type: 'HISTORY_COMMIT' })}
				style={{
					background: colors.bgInput,
					color: colors.textBright,
					border: `1px solid ${colors.border}`,
					borderRadius: 3,
					padding: '4px 8px',
					fontSize: 13,
					fontWeight: 600,
					outline: 'none',
				}}
			/>

			<div
				style={{
					height: 1,
					background: colors.border,
				}}
			/>

			<LayoutSection element={element} dispatch={dispatch} />

			<div style={{ height: 1, background: colors.border }} />

			<FillSection element={element} dispatch={dispatch} />

			<div style={{ height: 1, background: colors.border }} />

			{element.type === 'text' && (
				<TextSection
					element={element as TextElement}
					dispatch={dispatch}
				/>
			)}
			{element.type === 'solid' && (
				<SolidSection
					element={element as SolidElement}
					dispatch={dispatch}
				/>
			)}
			{(element.type === 'image' || element.type === 'video' || element.type === 'audio') && (
				<>
					<div style={{ height: 1, background: colors.border }} />
					<MediaSection
						element={element as ImageElement | VideoElement | AudioElement}
						dispatch={dispatch}
					/>
				</>
			)}
		</div>
	);
}
