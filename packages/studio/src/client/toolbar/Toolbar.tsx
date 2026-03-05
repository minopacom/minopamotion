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
	leftPanelCollapsed?: boolean;
	onToggleLeftPanel?: () => void;
}

export function Toolbar({ playerRef, leftPanelCollapsed, onToggleLeftPanel }: ToolbarProps) {
	const state = useStudioState();
	const dispatch = useStudioDispatch();
	const comp = state.compositions.find(
		(c) => c.id === state.selectedCompositionId,
	);

	return (
		<div
			style={{
				height: 56,
				background: colors.bgPanel,
				borderBottom: `1px solid ${colors.border}`,
				display: 'flex',
				alignItems: 'center',
				padding: '0 16px',
				gap: 16,
				flexShrink: 0,
				backdropFilter: 'blur(10px)',
			}}
		>
			{/* Left panel toggle */}
			{onToggleLeftPanel && (
				<>
					<button
						onClick={onToggleLeftPanel}
						style={{
							background: leftPanelCollapsed ? colors.bgInput : colors.bgSelected,
							color: leftPanelCollapsed ? colors.text : colors.textBright,
							border: `1px solid ${colors.border}`,
							borderRadius: 6,
							padding: '6px 12px',
							fontSize: 12,
							cursor: 'pointer',
							transition: 'all 0.15s ease',
							fontWeight: 500,
						}}
						onMouseEnter={(e) => {
							if (leftPanelCollapsed) {
								e.currentTarget.style.background = colors.bgHover;
								e.currentTarget.style.borderColor = colors.borderLight;
							}
						}}
						onMouseLeave={(e) => {
							if (leftPanelCollapsed) {
								e.currentTarget.style.background = colors.bgInput;
								e.currentTarget.style.borderColor = colors.border;
							}
						}}
						title={leftPanelCollapsed ? 'Show Assets Panel' : 'Hide Assets Panel'}
					>
						{leftPanelCollapsed ? '📁 Assets' : '◀ Hide'}
					</button>
					<div
						style={{
							width: 1,
							height: 24,
							background: colors.border,
						}}
					/>
				</>
			)}

			<EditorToolbar />

			<div style={{ flex: 1 }} />

			<ResolutionSelector />

			{comp && (
				<span
					style={{
						fontSize: 11,
						color: colors.textDim,
						fontFamily: 'monospace',
						padding: '6px 10px',
						background: colors.glass,
						border: `1px solid ${colors.glassBorder}`,
						borderRadius: 6,
						fontWeight: 500,
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
						: colors.glass,
					color: state.showCheckerboard ? colors.textBright : colors.text,
					border: `1px solid ${state.showCheckerboard ? colors.borderFocus : colors.glassBorder}`,
					borderRadius: 8,
					padding: '8px 14px',
					fontSize: 12,
					cursor: 'pointer',
					transition: 'all 0.2s ease',
					fontWeight: 500,
					boxShadow: state.showCheckerboard ? `0 0 0 3px ${colors.selectionGlow}` : 'none',
				}}
				onMouseEnter={(e) => {
					if (!state.showCheckerboard) {
						e.currentTarget.style.background = colors.bgHover;
						e.currentTarget.style.borderColor = colors.borderLight;
					}
				}}
				onMouseLeave={(e) => {
					if (!state.showCheckerboard) {
						e.currentTarget.style.background = colors.glass;
						e.currentTarget.style.borderColor = colors.glassBorder;
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
					background: colors.accentGradient,
					color: colors.textBright,
					border: 'none',
					borderRadius: 8,
					padding: '8px 20px',
					fontSize: 12,
					cursor: 'pointer',
					fontWeight: 600,
					transition: 'all 0.2s ease',
					boxShadow: `0 2px 8px rgba(99, 102, 241, 0.3)`,
				}}
				onMouseEnter={(e) => {
					e.currentTarget.style.transform = 'translateY(-1px)';
					e.currentTarget.style.boxShadow = `0 4px 12px rgba(99, 102, 241, 0.4)`;
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.transform = 'translateY(0)';
					e.currentTarget.style.boxShadow = `0 2px 8px rgba(99, 102, 241, 0.3)`;
				}}
				onClick={() =>
					dispatch({ type: 'SHOW_RENDER_DIALOG', show: true })
				}
			>
				✨ Render
			</button>
		</div>
	);
}
