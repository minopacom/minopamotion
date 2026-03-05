import React from 'react';
import { useStudioState, useStudioDispatch } from '../../store/context.js';
import { colors } from '../../utils/colors.js';

// Common video format presets
const PRESETS = [
	{ name: 'YouTube (16:9)', width: 1920, height: 1080 },
	{ name: 'Instagram Story', width: 1080, height: 1920 },
	{ name: 'Instagram Post', width: 1080, height: 1080 },
	{ name: 'TikTok', width: 1080, height: 1920 },
	{ name: 'Twitter', width: 1200, height: 675 },
	{ name: '4K (16:9)', width: 3840, height: 2160 },
	{ name: 'HD (16:9)', width: 1280, height: 720 },
];

export function SceneSettings() {
	const { editorScene } = useStudioState();
	const dispatch = useStudioDispatch();
	const { settings } = editorScene;

	const update = (partial: Partial<typeof settings>) => {
		dispatch({ type: 'UPDATE_SCENE_SETTINGS', settings: partial });
	};

	const commitHistory = () => dispatch({ type: 'HISTORY_COMMIT' });

	const applyPreset = (preset: typeof PRESETS[0]) => {
		update({ width: preset.width, height: preset.height });
		commitHistory();
	};

	const aspectRatio = (settings.width / settings.height).toFixed(2);

	return (
		<div
			style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 8 }}
			onBlur={commitHistory}
		>
			<div
				style={{
					fontSize: 11,
					fontWeight: 600,
					color: colors.textDim,
					textTransform: 'uppercase',
					letterSpacing: 1,
				}}
			>
				Scene Settings
			</div>

			{/* Preset buttons */}
			<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
				<span style={{ fontSize: 10, color: colors.textDim, fontWeight: 600 }}>
					Quick Presets
				</span>
				<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
					{PRESETS.map((preset) => (
						<button
							key={preset.name}
							onClick={() => applyPreset(preset)}
							style={{
								background: colors.bgInput,
								color: colors.text,
								border: `1px solid ${colors.border}`,
								borderRadius: 6,
								padding: '6px 8px',
								fontSize: 11,
								cursor: 'pointer',
								textAlign: 'left',
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
							<div style={{ fontWeight: 600 }}>{preset.name}</div>
							<div style={{ fontSize: 9, color: colors.textMuted }}>
								{preset.width}×{preset.height}
							</div>
						</button>
					))}
				</div>
			</div>

			<div style={{ height: 1, background: colors.border }} />

			<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
				<label style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
					<span style={{ fontSize: 10, color: colors.textDim }}>Width</span>
					<input
						type="number"
						value={settings.width}
						min={1}
						onChange={(e) => update({ width: Math.max(1, Number(e.target.value)) })}
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

				<label style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
					<span style={{ fontSize: 10, color: colors.textDim }}>Height</span>
					<input
						type="number"
						value={settings.height}
						min={1}
						onChange={(e) => update({ height: Math.max(1, Number(e.target.value)) })}
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

				<label style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
					<span style={{ fontSize: 10, color: colors.textDim }}>FPS</span>
					<input
						type="number"
						value={settings.fps}
						min={1}
						max={120}
						onChange={(e) => update({ fps: Math.max(1, Math.min(120, Number(e.target.value))) })}
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

				<label style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
					<span style={{ fontSize: 10, color: colors.textDim }}>Duration (frames)</span>
					<input
						type="number"
						value={settings.durationInFrames}
						min={1}
						onChange={(e) => update({ durationInFrames: Math.max(1, Number(e.target.value)) })}
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
			</div>

			{/* Info display */}
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 4,
				padding: 8,
				background: colors.bgLighter,
				borderRadius: 6,
				fontSize: 11,
				color: colors.textDim
			}}>
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<span>Aspect Ratio:</span>
					<span style={{ fontFamily: 'monospace', color: colors.text }}>{aspectRatio}</span>
				</div>
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<span>Total Duration:</span>
					<span style={{ fontFamily: 'monospace', color: colors.text }}>
						{(settings.durationInFrames / settings.fps).toFixed(2)}s
					</span>
				</div>
			</div>
		</div>
	);
}
