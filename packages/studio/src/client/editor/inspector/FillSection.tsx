import React from 'react';
import type { EditorElement } from '../types.js';
import type { StudioAction } from '../../store/types.js';
import { colors } from '../../utils/colors.js';

interface FillSectionProps {
	element: EditorElement;
	dispatch: React.Dispatch<StudioAction>;
}

export function FillSection({ element, dispatch }: FillSectionProps) {
	const opacity = element.transform.opacity;

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
			<div
				style={{
					fontSize: 10,
					fontWeight: 600,
					color: colors.textDim,
					textTransform: 'uppercase',
					letterSpacing: 1,
				}}
			>
				Fill
			</div>
			<div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
				<span style={{ fontSize: 11, color: colors.textDim }}>Opacity</span>
				<input
					type="range"
					min={0}
					max={100}
					value={Math.round(opacity * 100)}
					onChange={(e) =>
						dispatch({
							type: 'RESIZE_ELEMENT',
							id: element.id,
							transform: { opacity: Number(e.target.value) / 100 },
						})
					}
					onMouseUp={() => dispatch({ type: 'HISTORY_COMMIT' })}
					style={{ flex: 1 }}
				/>
				<span
					style={{
						fontSize: 11,
						color: colors.text,
						fontFamily: 'monospace',
						minWidth: 32,
						textAlign: 'right',
					}}
				>
					{Math.round(opacity * 100)}%
				</span>
			</div>
		</div>
	);
}
