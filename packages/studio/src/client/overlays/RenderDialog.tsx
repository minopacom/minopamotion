import React, { useState } from 'react';
import { useStudioState, useStudioDispatch } from '../store/context.js';
import { colors } from '../utils/colors.js';

const CODECS = ['h264', 'h265', 'vp8', 'vp9', 'av1', 'prores'] as const;
const FORMATS = ['mp4', 'webm', 'mov'] as const;

export function RenderDialog() {
	const state = useStudioState();
	const dispatch = useStudioDispatch();
	const [codec, setCodec] = useState<string>('h264');
	const [format, setFormat] = useState<string>('mp4');
	const [quality, setQuality] = useState(80);

	const comp = state.compositions.find(
		(c) => c.id === state.selectedCompositionId,
	);

	const close = () =>
		dispatch({ type: 'SHOW_RENDER_DIALOG', show: false });

	const labelStyle: React.CSSProperties = {
		fontSize: 12,
		color: colors.textDim,
		marginBottom: 4,
		display: 'block',
	};

	const selectStyle: React.CSSProperties = {
		width: '100%',
		background: colors.bgInput,
		color: colors.text,
		border: `1px solid ${colors.border}`,
		borderRadius: 4,
		padding: '6px 8px',
		fontSize: 13,
		outline: 'none',
	};

	return (
		<div
			style={{
				position: 'fixed',
				inset: 0,
				background: colors.overlay,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				zIndex: 1000,
			}}
			onClick={close}
		>
			<div
				onClick={(e) => e.stopPropagation()}
				style={{
					background: colors.bgPanel,
					border: `1px solid ${colors.border}`,
					borderRadius: 8,
					padding: 24,
					width: 400,
				}}
			>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						marginBottom: 20,
					}}
				>
					<h2
						style={{
							margin: 0,
							fontSize: 16,
							color: colors.textBright,
							fontWeight: 600,
						}}
					>
						Render Composition
					</h2>
					<button
						onClick={close}
						style={{
							background: 'none',
							border: 'none',
							color: colors.textDim,
							fontSize: 18,
							cursor: 'pointer',
						}}
					>
						x
					</button>
				</div>

				{comp && (
					<div
						style={{
							background: colors.bgInput,
							borderRadius: 4,
							padding: '8px 12px',
							marginBottom: 16,
							fontSize: 12,
							color: colors.text,
						}}
					>
						<strong>{comp.id}</strong> &mdash; {comp.width}x
						{comp.height} @ {comp.fps}fps,{' '}
						{comp.durationInFrames} frames
					</div>
				)}

				<div style={{ marginBottom: 12 }}>
					<label style={labelStyle}>Codec</label>
					<select
						value={codec}
						onChange={(e) => setCodec(e.target.value)}
						style={selectStyle}
					>
						{CODECS.map((c) => (
							<option key={c} value={c}>
								{c}
							</option>
						))}
					</select>
				</div>

				<div style={{ marginBottom: 12 }}>
					<label style={labelStyle}>Format</label>
					<select
						value={format}
						onChange={(e) => setFormat(e.target.value)}
						style={selectStyle}
					>
						{FORMATS.map((f) => (
							<option key={f} value={f}>
								{f}
							</option>
						))}
					</select>
				</div>

				<div style={{ marginBottom: 20 }}>
					<label style={labelStyle}>Quality: {quality}%</label>
					<input
						type="range"
						min={1}
						max={100}
						value={quality}
						onChange={(e) =>
							setQuality(Number(e.target.value))
						}
						style={{
							width: '100%',
							accentColor: colors.accent,
						}}
					/>
				</div>

				<button
					disabled
					style={{
						width: '100%',
						padding: '10px 16px',
						background: colors.bgInput,
						color: colors.textMuted,
						border: `1px solid ${colors.border}`,
						borderRadius: 4,
						fontSize: 13,
						cursor: 'not-allowed',
					}}
				>
					Render (Coming Soon)
				</button>
			</div>
		</div>
	);
}
