import React from 'react';
import type { ImageElement, VideoElement, AudioElement } from '../types.js';
import type { StudioAction } from '../../store/types.js';
import { colors } from '../../utils/colors.js';

interface MediaSectionProps {
	element: ImageElement | VideoElement | AudioElement;
	dispatch: React.Dispatch<StudioAction>;
}

export function MediaSection({ element, dispatch }: MediaSectionProps) {
	const update = (updates: Partial<typeof element>) => {
		dispatch({ type: 'UPDATE_ELEMENT', id: element.id, updates });
	};

	const hasObjectFit = element.type === 'image' || element.type === 'video';
	const hasVolume = element.type === 'video' || element.type === 'audio';
	const hasStartFrom = element.type === 'video' || element.type === 'audio';

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
				Media
			</div>

			<label style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
				<span style={{ fontSize: 10, color: colors.textDim }}>Source</span>
				<input
					type="text"
					value={element.src}
					onChange={(e) => update({ src: e.target.value })}
					onBlur={() => dispatch({ type: 'HISTORY_COMMIT' })}
					style={{
						background: colors.bgInput,
						color: colors.text,
						border: `1px solid ${colors.border}`,
						borderRadius: 3,
						padding: '4px 8px',
						fontSize: 11,
						fontFamily: 'monospace',
						outline: 'none',
					}}
				/>
			</label>

			{hasObjectFit && (
				<label style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
					<span style={{ fontSize: 10, color: colors.textDim }}>Object Fit</span>
					<select
						value={(element as ImageElement | VideoElement).objectFit}
						onChange={(e) => {
							update({ objectFit: e.target.value as 'cover' | 'contain' | 'fill' });
							dispatch({ type: 'HISTORY_COMMIT' });
						}}
						style={{
							background: colors.bgInput,
							color: colors.text,
							border: `1px solid ${colors.border}`,
							borderRadius: 3,
							padding: '4px 8px',
							fontSize: 12,
							outline: 'none',
						}}
					>
						<option value="contain">Contain</option>
						<option value="cover">Cover</option>
						<option value="fill">Fill</option>
					</select>
				</label>
			)}

			{hasVolume && (
				<div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
					<span style={{ fontSize: 10, color: colors.textDim }}>Volume</span>
					<div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
						<input
							type="range"
							min={0}
							max={100}
							value={Math.round((element as VideoElement | AudioElement).volume * 100)}
							onChange={(e) =>
								update({ volume: Number(e.target.value) / 100 })
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
							{Math.round((element as VideoElement | AudioElement).volume * 100)}%
						</span>
					</div>
				</div>
			)}

			{hasStartFrom && (
				<label style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
					<span style={{ fontSize: 10, color: colors.textDim }}>Start From (frames)</span>
					<input
						type="number"
						value={(element as VideoElement | AudioElement).startFrom}
						min={0}
						onChange={(e) => update({ startFrom: Math.max(0, Number(e.target.value)) })}
						onBlur={() => dispatch({ type: 'HISTORY_COMMIT' })}
						style={{
							background: colors.bgInput,
							color: colors.text,
							border: `1px solid ${colors.border}`,
							borderRadius: 3,
							padding: '4px 8px',
							fontSize: 12,
							fontFamily: 'monospace',
							outline: 'none',
						}}
					/>
				</label>
			)}
		</div>
	);
}
