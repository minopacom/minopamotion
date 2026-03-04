import React from 'react';
import type { PlayerRef } from '@minopamotion/player';
import { useStudioState, useStudioDispatch } from '../store/context.js';
import { PlaybackControls } from './PlaybackControls.js';
import { ZoomSelector } from './ZoomSelector.js';
import { RateSelector } from './RateSelector.js';
import { EditorToolbar } from '../editor/toolbar/EditorToolbar.js';
import { colors } from '../utils/colors.js';
import { formatTime } from '../utils/format-time.js';

interface ToolbarProps {
	playerRef: React.RefObject<PlayerRef | null>;
}

export function Toolbar({ playerRef }: ToolbarProps) {
	const state = useStudioState();
	const dispatch = useStudioDispatch();
	const comp = state.compositions.find(
		(c) => c.id === state.selectedCompositionId,
	);

	return (
		<div
			style={{
				height: 40,
				background: colors.bgPanel,
				borderBottom: `1px solid ${colors.border}`,
				display: 'flex',
				alignItems: 'center',
				padding: '0 8px',
				gap: 8,
				flexShrink: 0,
			}}
		>
			<PlaybackControls playerRef={playerRef} />

			<div
				style={{
					width: 1,
					height: 20,
					background: colors.border,
				}}
			/>

			<EditorToolbar />

			<div
				style={{
					width: 1,
					height: 20,
					background: colors.border,
				}}
			/>

			{comp && (
				<span
					style={{
						fontSize: 12,
						color: colors.textDim,
						fontFamily: 'monospace',
					}}
				>
					{formatTime(state.currentFrame, comp.fps)} /{' '}
					{formatTime(comp.durationInFrames, comp.fps)}
				</span>
			)}

			<div style={{ flex: 1 }} />

			{comp && (
				<span
					style={{
						fontSize: 11,
						color: colors.textMuted,
						fontFamily: 'monospace',
					}}
				>
					{comp.id}
				</span>
			)}

			<ZoomSelector />

			<button
				style={{
					background: state.showCheckerboard
						? colors.bgSelected
						: colors.bgInput,
					color: colors.text,
					border: `1px solid ${colors.border}`,
					borderRadius: 4,
					padding: '4px 8px',
					fontSize: 12,
					cursor: 'pointer',
				}}
				onClick={() => dispatch({ type: 'TOGGLE_CHECKERBOARD' })}
				title="Toggle checkerboard background"
			>
				Grid
			</button>

			<RateSelector playerRef={playerRef} />

			<button
				style={{
					background: colors.accent,
					color: colors.textBright,
					border: 'none',
					borderRadius: 4,
					padding: '4px 12px',
					fontSize: 12,
					cursor: 'pointer',
					fontWeight: 600,
				}}
				onClick={() =>
					dispatch({ type: 'SHOW_RENDER_DIALOG', show: true })
				}
			>
				Render
			</button>
		</div>
	);
}
