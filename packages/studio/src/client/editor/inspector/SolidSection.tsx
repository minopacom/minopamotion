import React from 'react';
import type { SolidElement } from '../types.js';
import type { StudioAction } from '../../store/types.js';
import { colors } from '../../utils/colors.js';

interface SolidSectionProps {
	element: SolidElement;
	dispatch: React.Dispatch<StudioAction>;
}

export function SolidSection({ element, dispatch }: SolidSectionProps) {
	const update = (updates: Partial<SolidElement>) => {
		dispatch({ type: 'UPDATE_ELEMENT', id: element.id, updates });
	};

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
				Shape
			</div>
			<label style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
				<span style={{ fontSize: 10, color: colors.textDim }}>Color</span>
				<div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
					<input
						type="color"
						value={element.color}
						onChange={(e) => update({ color: e.target.value })}
						onBlur={() => dispatch({ type: 'HISTORY_COMMIT' })}
						style={{
							width: 24,
							height: 24,
							border: `1px solid ${colors.border}`,
							borderRadius: 3,
							cursor: 'pointer',
							padding: 0,
						}}
					/>
					<input
						type="text"
						value={element.color}
						onChange={(e) => update({ color: e.target.value })}
						onBlur={() => dispatch({ type: 'HISTORY_COMMIT' })}
						style={{
							flex: 1,
							background: colors.bgInput,
							color: colors.text,
							border: `1px solid ${colors.border}`,
							borderRadius: 3,
							padding: '3px 6px',
							fontSize: 11,
							fontFamily: 'monospace',
							outline: 'none',
						}}
					/>
				</div>
			</label>
			<label style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
				<span style={{ fontSize: 10, color: colors.textDim }}>Border Radius</span>
				<input
					type="number"
					value={element.borderRadius}
					min={0}
					onChange={(e) => update({ borderRadius: Number(e.target.value) })}
					onBlur={() => dispatch({ type: 'HISTORY_COMMIT' })}
					style={{
						background: colors.bgInput,
						color: colors.text,
						border: `1px solid ${colors.border}`,
						borderRadius: 3,
						padding: '3px 6px',
						fontSize: 12,
						fontFamily: 'monospace',
						outline: 'none',
					}}
				/>
			</label>
		</div>
	);
}
