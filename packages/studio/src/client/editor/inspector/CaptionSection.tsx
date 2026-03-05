import React from 'react';
import { colors } from '../../utils/colors.js';
import type { CaptionElement } from '../types.js';
import type { StudioAction } from '../../store/types.js';

interface CaptionSectionProps {
	element: CaptionElement;
	dispatch: React.Dispatch<StudioAction>;
}

export function CaptionSection({ element, dispatch }: CaptionSectionProps) {
	const update = (updates: Partial<CaptionElement>) => {
		dispatch({ type: 'UPDATE_ELEMENT', id: element.id, updates });
	};

	const labelStyle: React.CSSProperties = {
		fontSize: 11,
		color: colors.textDim,
		fontWeight: 600,
		textTransform: 'uppercase',
		letterSpacing: '0.5px',
		marginBottom: 6,
	};

	const inputStyle: React.CSSProperties = {
		background: colors.bgInput,
		color: colors.text,
		border: `1px solid ${colors.border}`,
		borderRadius: 3,
		padding: '4px 8px',
		fontSize: 12,
		outline: 'none',
		width: '100%',
	};

	const selectStyle: React.CSSProperties = {
		...inputStyle,
		cursor: 'pointer',
	};

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
			<div>
				<div style={labelStyle}>Caption</div>
				<div style={{ fontSize: 10, color: colors.textMuted, marginBottom: 6 }}>
					Caption Text
				</div>
				<textarea
					value={element.text}
					onChange={(e) => update({ text: e.target.value })}
					onBlur={() => dispatch({ type: 'HISTORY_COMMIT' })}
					style={{
						...inputStyle,
						minHeight: 60,
						resize: 'vertical',
						fontFamily: 'inherit',
					}}
					placeholder="Enter caption text..."
				/>
			</div>

			<div>
				<div style={labelStyle}>Typography</div>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: '1fr 1fr',
						gap: 8,
					}}
				>
					<div>
						<div style={{ ...labelStyle, textTransform: 'none', fontSize: 10, marginBottom: 4 }}>
							Font Size
						</div>
						<input
							type="number"
							value={element.fontSize}
							onChange={(e) =>
								update({ fontSize: Number(e.target.value) })
							}
							onBlur={() => dispatch({ type: 'HISTORY_COMMIT' })}
							style={inputStyle}
							min={8}
							max={200}
						/>
					</div>
					<div>
						<div style={{ ...labelStyle, textTransform: 'none', fontSize: 10, marginBottom: 4 }}>
							Font Weight
						</div>
						<select
							value={element.fontWeight}
							onChange={(e) =>
								update({ fontWeight: Number(e.target.value) })
							}
							onBlur={() => dispatch({ type: 'HISTORY_COMMIT' })}
							style={selectStyle}
						>
							<option value={400}>Normal</option>
							<option value={500}>Medium</option>
							<option value={600}>Semi Bold</option>
							<option value={700}>Bold</option>
							<option value={900}>Black</option>
						</select>
					</div>
				</div>

				<div style={{ marginTop: 8 }}>
					<div style={{ ...labelStyle, textTransform: 'none', fontSize: 10, marginBottom: 4 }}>
						Text Alignment
					</div>
					<div style={{ display: 'flex', gap: 4 }}>
						{(['left', 'center', 'right'] as const).map((align) => (
							<button
								key={align}
								onClick={() => {
									update({ textAlign: align });
									dispatch({ type: 'HISTORY_COMMIT' });
								}}
								style={{
									flex: 1,
									padding: '6px',
									background:
										element.textAlign === align
											? colors.bgSelected
											: colors.bgInput,
									color:
										element.textAlign === align
											? colors.textBright
											: colors.text,
									border: `1px solid ${element.textAlign === align ? colors.borderFocus : colors.border}`,
									borderRadius: 3,
									fontSize: 11,
									cursor: 'pointer',
									textTransform: 'capitalize',
								}}
							>
								{align}
							</button>
						))}
					</div>
				</div>
			</div>

			<div>
				<div style={labelStyle}>Colors</div>
				<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
					<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
						<input
							type="color"
							value={element.color}
							onChange={(e) => update({ color: e.target.value })}
							onBlur={() => dispatch({ type: 'HISTORY_COMMIT' })}
							style={{ width: 40, height: 28, border: 'none', cursor: 'pointer' }}
						/>
						<div style={{ flex: 1 }}>
							<div style={{ fontSize: 10, color: colors.textMuted }}>
								Text Color
							</div>
							<input
								type="text"
								value={element.color}
								onChange={(e) => update({ color: e.target.value })}
								onBlur={() => dispatch({ type: 'HISTORY_COMMIT' })}
								style={{ ...inputStyle, fontSize: 11 }}
							/>
						</div>
					</div>

					<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
						<input
							type="color"
							value={element.backgroundColor}
							onChange={(e) =>
								update({ backgroundColor: e.target.value })
							}
							onBlur={() => dispatch({ type: 'HISTORY_COMMIT' })}
							style={{ width: 40, height: 28, border: 'none', cursor: 'pointer' }}
						/>
						<div style={{ flex: 1 }}>
							<div style={{ fontSize: 10, color: colors.textMuted }}>
								Background
							</div>
							<input
								type="text"
								value={element.backgroundColor}
								onChange={(e) =>
									update({ backgroundColor: e.target.value })
								}
								onBlur={() => dispatch({ type: 'HISTORY_COMMIT' })}
								style={{ ...inputStyle, fontSize: 11 }}
							/>
						</div>
					</div>

					<div>
						<div style={{ fontSize: 10, color: colors.textMuted, marginBottom: 4 }}>
							Background Opacity: {Math.round(element.backgroundOpacity * 100)}%
						</div>
						<input
							type="range"
							min={0}
							max={1}
							step={0.01}
							value={element.backgroundOpacity}
							onChange={(e) =>
								update({
									backgroundOpacity: Number(e.target.value),
								})
							}
							onMouseUp={() => dispatch({ type: 'HISTORY_COMMIT' })}
							style={{ width: '100%', accentColor: colors.accent }}
						/>
					</div>

					{element.highlightColor && (
						<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
							<input
								type="color"
								value={element.highlightColor}
								onChange={(e) =>
									update({ highlightColor: e.target.value })
								}
								onBlur={() => dispatch({ type: 'HISTORY_COMMIT' })}
								style={{ width: 40, height: 28, border: 'none', cursor: 'pointer' }}
							/>
							<div style={{ flex: 1 }}>
								<div style={{ fontSize: 10, color: colors.textMuted }}>
									Highlight Color
								</div>
								<input
									type="text"
									value={element.highlightColor}
									onChange={(e) =>
										update({ highlightColor: e.target.value })
									}
									onBlur={() => dispatch({ type: 'HISTORY_COMMIT' })}
									style={{ ...inputStyle, fontSize: 11 }}
								/>
							</div>
						</div>
					)}
				</div>
			</div>

			<div>
				<div style={labelStyle}>Spacing & Style</div>
				<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
					<div>
						<div style={{ fontSize: 10, color: colors.textMuted, marginBottom: 4 }}>
							Padding
						</div>
						<input
							type="number"
							value={element.padding}
							onChange={(e) =>
								update({ padding: Number(e.target.value) })
							}
							onBlur={() => dispatch({ type: 'HISTORY_COMMIT' })}
							style={inputStyle}
							min={0}
							max={100}
						/>
					</div>
					<div>
						<div style={{ fontSize: 10, color: colors.textMuted, marginBottom: 4 }}>
							Border Radius
						</div>
						<input
							type="number"
							value={element.borderRadius}
							onChange={(e) =>
								update({ borderRadius: Number(e.target.value) })
							}
							onBlur={() => dispatch({ type: 'HISTORY_COMMIT' })}
							style={inputStyle}
							min={0}
							max={100}
						/>
					</div>
				</div>
			</div>

			<div>
				<div style={labelStyle}>Position Preset</div>
				<div style={{ display: 'flex', gap: 4 }}>
					{(['top', 'center', 'bottom'] as const).map((pos) => (
						<button
							key={pos}
							onClick={() => {
								update({ position: pos });
								dispatch({ type: 'HISTORY_COMMIT' });
							}}
							style={{
								flex: 1,
								padding: '8px',
								background:
									element.position === pos
										? colors.bgSelected
										: colors.bgInput,
								color:
									element.position === pos
										? colors.textBright
										: colors.text,
								border: `1px solid ${element.position === pos ? colors.borderFocus : colors.border}`,
								borderRadius: 3,
								fontSize: 11,
								cursor: 'pointer',
								textTransform: 'capitalize',
							}}
						>
							{pos}
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
