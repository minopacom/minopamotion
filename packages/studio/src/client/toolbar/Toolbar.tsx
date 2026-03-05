import React from 'react';
import type { PlayerRef } from '@minopamotion/player';
import { useStudioState, useStudioDispatch } from '../store/context.js';
import { ZoomSelector } from './ZoomSelector.js';
import { RateSelector } from './RateSelector.js';
import { ResolutionSelector } from './ResolutionSelector.js';
import { EditorToolbar } from '../editor/toolbar/EditorToolbar.js';
import { colors } from '../utils/colors.js';

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
				height: 48,
				background: colors.bgPanel,
				borderBottom: `1px solid ${colors.border}`,
				display: 'flex',
				alignItems: 'center',
				padding: '0 12px',
				gap: 12,
				flexShrink: 0,
			}}
		>
			<EditorToolbar />

			<div style={{ flex: 1 }} />

			<ResolutionSelector />

			{comp && (
				<span
					style={{
						fontSize: 11,
						color: colors.textMuted,
						fontFamily: 'monospace',
						padding: '4px 8px',
						background: colors.bgInput,
						borderRadius: 4,
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
					color: state.showCheckerboard ? colors.textBright : colors.text,
					border: `1px solid ${state.showCheckerboard ? colors.borderFocus : colors.border}`,
					borderRadius: 6,
					padding: '6px 12px',
					fontSize: 12,
					cursor: 'pointer',
					transition: 'all 0.15s ease',
					fontWeight: state.showCheckerboard ? 600 : 400,
				}}
				onMouseEnter={(e) => {
					if (!state.showCheckerboard) {
						e.currentTarget.style.background = colors.bgHover;
						e.currentTarget.style.borderColor = colors.borderLight;
					}
				}}
				onMouseLeave={(e) => {
					if (!state.showCheckerboard) {
						e.currentTarget.style.background = colors.bgInput;
						e.currentTarget.style.borderColor = colors.border;
					}
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
					borderRadius: 6,
					padding: '6px 16px',
					fontSize: 12,
					cursor: 'pointer',
					fontWeight: 600,
					transition: 'all 0.15s ease',
					boxShadow: `0 1px 2px ${colors.overlayLight}`,
				}}
				onMouseEnter={(e) => {
					e.currentTarget.style.background = colors.accentLight;
					e.currentTarget.style.transform = 'translateY(-1px)';
					e.currentTarget.style.boxShadow = `0 2px 4px ${colors.overlayLight}`;
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.background = colors.accent;
					e.currentTarget.style.transform = 'translateY(0)';
					e.currentTarget.style.boxShadow = `0 1px 2px ${colors.overlayLight}`;
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
