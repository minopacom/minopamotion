import React from 'react';
import type { EditorElement, Transform } from '../types.js';
import type { StudioAction } from '../../store/types.js';
import { colors } from '../../utils/colors.js';

interface LayoutSectionProps {
	element: EditorElement;
	dispatch: React.Dispatch<StudioAction>;
}

interface NumericFieldProps {
	label: string;
	value: number;
	onChange: (value: number) => void;
	min?: number;
	max?: number;
	step?: number;
}

function NumericField({ label, value, onChange, min, max, step = 1 }: NumericFieldProps) {
	return (
		<label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
			<span
				style={{
					fontSize: 11,
					color: colors.textDim,
					width: 14,
					textAlign: 'center',
				}}
			>
				{label}
			</span>
			<input
				type="number"
				value={value}
				min={min}
				max={max}
				step={step}
				onChange={(e) => onChange(Number(e.target.value))}
				onBlur={() => onChange(value)}
				style={{
					width: '100%',
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
	);
}

export function LayoutSection({ element, dispatch }: LayoutSectionProps) {
	const update = (transform: Partial<Transform>) =>
		dispatch({
			type: 'RESIZE_ELEMENT',
			id: element.id,
			transform,
		});

	const commitHistory = () => dispatch({ type: 'HISTORY_COMMIT' });

	return (
		<div
			style={{ display: 'flex', flexDirection: 'column', gap: 6 }}
			onBlur={commitHistory}
		>
			<div
				style={{
					fontSize: 10,
					fontWeight: 600,
					color: colors.textDim,
					textTransform: 'uppercase',
					letterSpacing: 1,
				}}
			>
				Layout
			</div>
			<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
				<NumericField
					label="X"
					value={element.transform.x}
					onChange={(x) => update({ x })}
				/>
				<NumericField
					label="Y"
					value={element.transform.y}
					onChange={(y) => update({ y })}
				/>
				<NumericField
					label="W"
					value={element.transform.width}
					onChange={(width) => update({ width: Math.max(1, width) })}
					min={1}
				/>
				<NumericField
					label="H"
					value={element.transform.height}
					onChange={(height) => update({ height: Math.max(1, height) })}
					min={1}
				/>
			</div>
			<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
				<NumericField
					label="R"
					value={element.transform.rotation}
					onChange={(rotation) => update({ rotation })}
				/>
				<NumericField
					label="O"
					value={Math.round(element.transform.opacity * 100)}
					onChange={(v) => update({ opacity: Math.max(0, Math.min(100, v)) / 100 })}
					min={0}
					max={100}
				/>
			</div>
		</div>
	);
}
