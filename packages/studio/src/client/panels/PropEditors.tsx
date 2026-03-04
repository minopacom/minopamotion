import React from 'react';
import { colors } from '../utils/colors.js';

interface EditorProps {
	value: unknown;
	onChange: (value: unknown) => void;
}

const inputStyle: React.CSSProperties = {
	background: colors.bgInput,
	color: colors.text,
	border: `1px solid ${colors.border}`,
	borderRadius: 4,
	padding: '4px 8px',
	fontSize: 12,
	outline: 'none',
	width: '100%',
	boxSizing: 'border-box',
};

export function StringEditor({ value, onChange }: EditorProps) {
	return (
		<input
			type="text"
			value={String(value ?? '')}
			onChange={(e) => onChange(e.target.value)}
			style={inputStyle}
		/>
	);
}

export function NumberEditor({ value, onChange }: EditorProps) {
	const num = Number(value) || 0;
	return (
		<div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
			<input
				type="number"
				value={num}
				onChange={(e) => onChange(Number(e.target.value))}
				style={{ ...inputStyle, flex: 1 }}
			/>
			<input
				type="range"
				min={Math.min(0, num * 2)}
				max={Math.max(100, num * 2)}
				value={num}
				onChange={(e) => onChange(Number(e.target.value))}
				style={{ flex: 1, accentColor: colors.accent }}
			/>
		</div>
	);
}

export function BooleanEditor({ value, onChange }: EditorProps) {
	const checked = Boolean(value);
	return (
		<label
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 8,
				cursor: 'pointer',
				fontSize: 12,
				color: colors.text,
			}}
		>
			<div
				onClick={() => onChange(!checked)}
				style={{
					width: 36,
					height: 20,
					borderRadius: 10,
					background: checked ? colors.accent : colors.bgInput,
					border: `1px solid ${colors.border}`,
					position: 'relative',
					cursor: 'pointer',
					transition: 'background 0.15s',
				}}
			>
				<div
					style={{
						width: 16,
						height: 16,
						borderRadius: '50%',
						background: colors.textBright,
						position: 'absolute',
						top: 1,
						left: checked ? 17 : 1,
						transition: 'left 0.15s',
					}}
				/>
			</div>
			{checked ? 'true' : 'false'}
		</label>
	);
}

export function ColorEditor({ value, onChange }: EditorProps) {
	const colorStr = String(value ?? '#000000');
	return (
		<div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
			<input
				type="color"
				value={colorStr.startsWith('#') ? colorStr : '#000000'}
				onChange={(e) => onChange(e.target.value)}
				style={{
					width: 32,
					height: 28,
					border: `1px solid ${colors.border}`,
					borderRadius: 4,
					padding: 0,
					cursor: 'pointer',
					background: 'none',
				}}
			/>
			<input
				type="text"
				value={colorStr}
				onChange={(e) => onChange(e.target.value)}
				style={{ ...inputStyle, flex: 1 }}
			/>
		</div>
	);
}

interface ObjectEditorProps {
	value: Record<string, unknown>;
	onChange: (value: Record<string, unknown>) => void;
	defaultValues?: Record<string, unknown>;
	onReset?: (key: string) => void;
}

export function ObjectEditor({
	value,
	onChange,
	defaultValues,
	onReset,
}: ObjectEditorProps) {
	return (
		<div
			style={{
				paddingLeft: 12,
				borderLeft: `2px solid ${colors.border}`,
				marginTop: 4,
			}}
		>
			{Object.entries(value).map(([k, v]) => (
				<PropField
					key={k}
					name={k}
					value={v}
					onChange={(newVal) =>
						onChange({ ...value, [k]: newVal })
					}
					defaultValue={defaultValues?.[k]}
					onReset={onReset ? () => onReset(k) : undefined}
				/>
			))}
		</div>
	);
}

// Re-export a higher-level composed field
import { detectPropType } from '../utils/detect-prop-type.js';

interface PropFieldProps {
	name: string;
	value: unknown;
	onChange: (value: unknown) => void;
	defaultValue?: unknown;
	onReset?: () => void;
}

export function PropField({
	name,
	value,
	onChange,
	defaultValue,
	onReset,
}: PropFieldProps) {
	const type = detectPropType(value);
	const hasChanged =
		defaultValue !== undefined &&
		JSON.stringify(value) !== JSON.stringify(defaultValue);

	return (
		<div style={{ marginBottom: 8 }}>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 4,
					marginBottom: 4,
				}}
			>
				<span
					style={{
						fontSize: 12,
						color: colors.textDim,
						fontFamily: 'monospace',
					}}
				>
					{name}
				</span>
				<span
					style={{
						fontSize: 9,
						color: colors.textMuted,
						textTransform: 'uppercase',
					}}
				>
					{type}
				</span>
				{hasChanged && onReset && (
					<button
						onClick={onReset}
						style={{
							marginLeft: 'auto',
							background: 'none',
							border: 'none',
							color: colors.textMuted,
							fontSize: 10,
							cursor: 'pointer',
							padding: '0 4px',
						}}
						title="Reset to default"
					>
						Reset
					</button>
				)}
			</div>

			{type === 'string' && (
				<StringEditor value={value} onChange={onChange} />
			)}
			{type === 'number' && (
				<NumberEditor value={value} onChange={onChange} />
			)}
			{type === 'boolean' && (
				<BooleanEditor value={value} onChange={onChange} />
			)}
			{type === 'color' && (
				<ColorEditor value={value} onChange={onChange} />
			)}
			{type === 'object' && (
				<ObjectEditor
					value={value as Record<string, unknown>}
					onChange={(v) => onChange(v)}
				/>
			)}
			{(type === 'array' || type === 'null') && (
				<textarea
					value={JSON.stringify(value, null, 2)}
					onChange={(e) => {
						try {
							onChange(JSON.parse(e.target.value));
						} catch {
							// keep editing
						}
					}}
					style={{
						...inputStyle,
						fontFamily: 'monospace',
						resize: 'vertical',
						minHeight: 40,
					}}
				/>
			)}
		</div>
	);
}
