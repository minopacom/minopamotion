import React, { useState } from 'react';
import { useStudioState, useStudioDispatch } from '../store/context.js';
import { colors } from '../utils/colors.js';

const PRESETS = [
	{ name: 'YouTube 1080p', width: 1920, height: 1080, icon: '📺' },
	{ name: 'Instagram Story', width: 1080, height: 1920, icon: '📱' },
	{ name: 'Instagram Post', width: 1080, height: 1080, icon: '📷' },
	{ name: 'TikTok', width: 1080, height: 1920, icon: '🎵' },
	{ name: 'Twitter', width: 1200, height: 675, icon: '🐦' },
	{ name: '4K', width: 3840, height: 2160, icon: '🎬' },
	{ name: 'HD 720p', width: 1280, height: 720, icon: '📺' },
];

export function ResolutionSelector() {
	const { editorMode, editorScene } = useStudioState();
	const dispatch = useStudioDispatch();
	const [isOpen, setIsOpen] = useState(false);

	if (!editorMode) return null;

	const { width, height } = editorScene.settings;
	const currentPreset = PRESETS.find(p => p.width === width && p.height === height);
	const displayText = currentPreset
		? currentPreset.name
		: `${width}×${height}`;

	const applyPreset = (preset: typeof PRESETS[0]) => {
		dispatch({
			type: 'UPDATE_SCENE_SETTINGS',
			settings: { width: preset.width, height: preset.height },
		});
		dispatch({ type: 'HISTORY_COMMIT' });
		setIsOpen(false);
	};

	return (
		<div style={{ position: 'relative' }}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				style={{
					background: colors.bgInput,
					color: colors.text,
					border: `1px solid ${colors.border}`,
					borderRadius: 6,
					padding: '6px 12px',
					fontSize: 12,
					cursor: 'pointer',
					display: 'flex',
					alignItems: 'center',
					gap: 6,
					fontFamily: 'monospace',
					transition: 'all 0.15s ease',
				}}
				onMouseEnter={(e) => {
					e.currentTarget.style.background = colors.bgHover;
					e.currentTarget.style.borderColor = colors.borderLight;
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.background = colors.bgInput;
					e.currentTarget.style.borderColor = colors.border;
				}}
			>
				<span>🎥</span>
				<span>{displayText}</span>
				<span style={{ fontSize: 10 }}>▼</span>
			</button>

			{isOpen && (
				<>
					{/* Backdrop to close dropdown */}
					<div
						onClick={() => setIsOpen(false)}
						style={{
							position: 'fixed',
							inset: 0,
							zIndex: 999,
						}}
					/>
					{/* Dropdown menu */}
					<div
						style={{
							position: 'absolute',
							top: 'calc(100% + 4px)',
							right: 0,
							background: colors.bgPanel,
							border: `1px solid ${colors.border}`,
							borderRadius: 8,
							padding: 8,
							minWidth: 220,
							boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
							zIndex: 1000,
						}}
					>
						<div style={{
							fontSize: 10,
							color: colors.textDim,
							fontWeight: 600,
							textTransform: 'uppercase',
							letterSpacing: 1,
							marginBottom: 8,
							paddingLeft: 4,
						}}>
							Video Resolution
						</div>
						{PRESETS.map((preset) => {
							const isActive = preset.width === width && preset.height === height;
							return (
								<button
									key={preset.name}
									onClick={() => applyPreset(preset)}
									style={{
										width: '100%',
										background: isActive ? colors.bgSelected : 'transparent',
										color: isActive ? colors.textBright : colors.text,
										border: 'none',
										borderRadius: 6,
										padding: '8px 10px',
										fontSize: 12,
										cursor: 'pointer',
										textAlign: 'left',
										display: 'flex',
										alignItems: 'center',
										gap: 8,
										transition: 'all 0.15s ease',
										marginBottom: 2,
									}}
									onMouseEnter={(e) => {
										if (!isActive) {
											e.currentTarget.style.background = colors.bgHover;
										}
									}}
									onMouseLeave={(e) => {
										if (!isActive) {
											e.currentTarget.style.background = 'transparent';
										}
									}}
								>
									<span style={{ fontSize: 16 }}>{preset.icon}</span>
									<div style={{ flex: 1 }}>
										<div style={{ fontWeight: 600 }}>{preset.name}</div>
										<div style={{ fontSize: 10, color: colors.textMuted, fontFamily: 'monospace' }}>
											{preset.width}×{preset.height}
										</div>
									</div>
									{isActive && <span style={{ color: colors.accent }}>✓</span>}
								</button>
							);
						})}
					</div>
				</>
			)}
		</div>
	);
}
