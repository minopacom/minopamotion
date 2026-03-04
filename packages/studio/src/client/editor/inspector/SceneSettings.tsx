import React from 'react';
import { useStudioState, useStudioDispatch } from '../../store/context.js';
import { colors } from '../../utils/colors.js';

export function SceneSettings() {
	const { editorScene } = useStudioState();
	const dispatch = useStudioDispatch();
	const { settings } = editorScene;

	const update = (partial: Partial<typeof settings>) => {
		dispatch({ type: 'UPDATE_SCENE_SETTINGS', settings: partial });
	};

	const commitHistory = () => dispatch({ type: 'HISTORY_COMMIT' });

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

			<div style={{ fontSize: 11, color: colors.textDim }}>
				Total duration: {(settings.durationInFrames / settings.fps).toFixed(2)}s
			</div>
		</div>
	);
}
