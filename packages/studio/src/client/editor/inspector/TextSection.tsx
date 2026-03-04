import React from 'react';
import type { TextElement } from '../types.js';
import type { StudioAction } from '../../store/types.js';
import { colors } from '../../utils/colors.js';

interface TextSectionProps {
	element: TextElement;
	dispatch: React.Dispatch<StudioAction>;
}

export function TextSection({ element, dispatch }: TextSectionProps) {
	const update = (updates: Partial<TextElement>) => {
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
				Text
			</div>
			<textarea
				value={element.text}
				onChange={(e) => update({ text: e.target.value })}
				onBlur={() => dispatch({ type: 'HISTORY_COMMIT' })}
				style={{
					width: '100%',
					height: 60,
					boxSizing: 'border-box',
					background: colors.bgInput,
					color: colors.text,
					border: `1px solid ${colors.border}`,
					borderRadius: 3,
					padding: 6,
					fontSize: 12,
					fontFamily: 'monospace',
					resize: 'vertical',
					outline: 'none',
				}}
			/>
			<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
				<label style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
					<span style={{ fontSize: 10, color: colors.textDim }}>Size</span>
					<input
						type="number"
						value={element.fontSize}
						min={1}
						onChange={(e) => update({ fontSize: Number(e.target.value) })}
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
				<label style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
					<span style={{ fontSize: 10, color: colors.textDim }}>Weight</span>
					<select
						value={element.fontWeight}
						onChange={(e) => {
							update({ fontWeight: Number(e.target.value) });
							dispatch({ type: 'HISTORY_COMMIT' });
						}}
						style={{
							background: colors.bgInput,
							color: colors.text,
							border: `1px solid ${colors.border}`,
							borderRadius: 3,
							padding: '3px 6px',
							fontSize: 12,
							outline: 'none',
						}}
					>
						<option value={300}>Light</option>
						<option value={400}>Regular</option>
						<option value={600}>Semi</option>
						<option value={700}>Bold</option>
						<option value={900}>Black</option>
					</select>
				</label>
			</div>
			<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
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
					<span style={{ fontSize: 10, color: colors.textDim }}>Align</span>
					<select
						value={element.textAlign}
						onChange={(e) => {
							update({ textAlign: e.target.value as 'left' | 'center' | 'right' });
							dispatch({ type: 'HISTORY_COMMIT' });
						}}
						style={{
							background: colors.bgInput,
							color: colors.text,
							border: `1px solid ${colors.border}`,
							borderRadius: 3,
							padding: '3px 6px',
							fontSize: 12,
							outline: 'none',
						}}
					>
						<option value="left">Left</option>
						<option value="center">Center</option>
						<option value="right">Right</option>
					</select>
				</label>
			</div>
			<label style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
				<span style={{ fontSize: 10, color: colors.textDim }}>Font</span>
				<input
					type="text"
					value={element.fontFamily}
					onChange={(e) => update({ fontFamily: e.target.value })}
					onBlur={() => dispatch({ type: 'HISTORY_COMMIT' })}
					style={{
						background: colors.bgInput,
						color: colors.text,
						border: `1px solid ${colors.border}`,
						borderRadius: 3,
						padding: '3px 6px',
						fontSize: 12,
						outline: 'none',
					}}
				/>
			</label>
		</div>
	);
}
