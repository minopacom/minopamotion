import React, { useRef, useEffect, useCallback, useMemo, useState } from 'react';
import type { PlayerRef } from '@minopamotion/player';
import type { TComposition } from '@minopamotion/core';
import type { TrackDefinition } from './store/types.js';
import { useStudioStore } from './store/useStudioStore.js';
import {
	StudioStateContext,
	StudioDispatchContext,
} from './store/context.js';
import { GroupedToolbar } from './toolbar/GroupedToolbar.js';
import { CompositionList } from './panels/CompositionList.js';
import { PropsPanel } from './panels/PropsPanel.js';
import { Preview } from './preview/Preview.js';
import { Timeline } from './timeline/Timeline.js';
import { KeyboardShortcutsHelp } from './overlays/KeyboardShortcutsHelp.js';
import { QuickSwitcher } from './overlays/QuickSwitcher.js';
import { RenderDialog } from './overlays/RenderDialog.js';
import { EditorComposition } from './editor/EditorComposition.js';
import { AssetLibrary } from './editor/panels/AssetLibrary.js';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts.js';
import { useDragHandle } from './hooks/useDragHandle.js';
import { ResizeHandle } from './components/ResizeHandle.js';
import { colors } from './utils/colors.js';
import { useMediaQuery, breakpoints } from './utils/useMediaQuery.js';
import { MobileStudio } from './mobile/MobileStudio.js';

export interface StudioProps {
	compositions: TComposition[];
	tracks?: TrackDefinition[];
}

export function Studio({ compositions, tracks }: StudioProps) {
	const [state, dispatch] = useStudioStore(compositions, tracks);
	const playerRef = useRef<PlayerRef>(null);
	const isMobile = useMediaQuery(breakpoints.mobile);
	const isTablet = useMediaQuery(breakpoints.tablet);
	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);

	const selectedComp = state.compositions.find(
		(c) => c.id === state.selectedCompositionId,
	);

	// In editor mode, create a synthetic composition wrapping EditorComposition
	const editorComp: TComposition | null = useMemo(() => {
		if (!state.editorMode) return null;
		const { settings } = state.editorScene;
		return {
			id: '__editor__',
			component: EditorComposition,
			defaultProps: {},
			width: settings.width,
			height: settings.height,
			fps: settings.fps,
			durationInFrames: settings.durationInFrames,
			nonce: 0,
		};
	}, [state.editorMode, state.editorScene.settings]);

	const activeComp = (state.editorMode ? editorComp : selectedComp) ?? selectedComp;

	// Sync player events → store
	useEffect(() => {
		const player = playerRef.current;
		if (!player) return;

		const unsubs = [
			player.addEventListener('frameupdate', (frame) => {
				dispatch({ type: 'SET_FRAME', frame });
			}),
			player.addEventListener('play', () => {
				dispatch({ type: 'SET_PLAYING', playing: true });
			}),
			player.addEventListener('pause', () => {
				dispatch({ type: 'SET_PLAYING', playing: false });
			}),
			player.addEventListener('ratechange', (rate) => {
				dispatch({ type: 'SET_PLAYBACK_RATE', rate });
			}),
		];

		return () => unsubs.forEach((u) => u());
	}, [selectedComp, dispatch]);

	// Keyboard shortcuts
	useKeyboardShortcuts({
		dispatch,
		playerRef,
		currentFrame: state.currentFrame,
		playing: state.playing,
		editorMode: state.editorMode,
		selectedElementIds: state.selectedElementIds,
		durationInFrames: activeComp?.durationInFrames || 0,
	});

	// Use refs to track current values without causing re-renders
	const leftPanelWidthRef = useRef(state.leftPanelWidth);
	const rightPanelWidthRef = useRef(state.rightPanelWidth);
	const timelineHeightRef = useRef(state.timelineHeight);

	// Update refs when state changes
	useEffect(() => {
		leftPanelWidthRef.current = state.leftPanelWidth;
	}, [state.leftPanelWidth]);

	useEffect(() => {
		rightPanelWidthRef.current = state.rightPanelWidth;
	}, [state.rightPanelWidth]);

	useEffect(() => {
		timelineHeightRef.current = state.timelineHeight;
	}, [state.timelineHeight]);

	// Panel resize handlers
	const leftDrag = useDragHandle({
		direction: 'horizontal',
		onDrag: useCallback(
			(delta: number) =>
				dispatch({
					type: 'SET_LEFT_PANEL_WIDTH',
					width: leftPanelWidthRef.current + delta,
				}),
			[dispatch],
		),
	});

	const rightDrag = useDragHandle({
		direction: 'horizontal',
		onDrag: useCallback(
			(delta: number) =>
				dispatch({
					type: 'SET_RIGHT_PANEL_WIDTH',
					width: rightPanelWidthRef.current - delta,
				}),
			[dispatch],
		),
	});

	const timelineDrag = useDragHandle({
		direction: 'vertical',
		onDrag: useCallback(
			(delta: number) =>
				dispatch({
					type: 'SET_TIMELINE_HEIGHT',
					height: timelineHeightRef.current - delta,
				}),
			[dispatch],
		),
	});

	// Use mobile layout for small screens
	if (isMobile) {
		return (
			<StudioStateContext.Provider value={state}>
				<StudioDispatchContext.Provider value={dispatch}>
					<MobileStudio playerRef={playerRef} activeComp={activeComp} />
					{/* Overlays */}
					{state.showShortcutsHelp && <KeyboardShortcutsHelp />}
					{state.showQuickSwitcher && <QuickSwitcher />}
					{state.showRenderDialog && <RenderDialog playerRef={playerRef} />}
				</StudioDispatchContext.Provider>
			</StudioStateContext.Provider>
		);
	}

	return (
		<StudioStateContext.Provider value={state}>
			<StudioDispatchContext.Provider value={dispatch}>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						height: '100vh',
						background: colors.bg,
						fontFamily:
							'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
						color: colors.text,
						overflow: 'hidden',
					}}
				>
					{/* Toolbar */}
					<GroupedToolbar
						playerRef={playerRef}
						leftPanelCollapsed={leftPanelCollapsed}
						onToggleLeftPanel={!isTablet ? () => setLeftPanelCollapsed(!leftPanelCollapsed) : undefined}
					/>

					{/* Main area */}
					<div
						style={{
							display: 'flex',
							flex: 1,
							overflow: 'hidden',
						}}
					>
						{/* Preview - Full width, no left panel */}
						<div
							style={{
								flex: 1,
								display: 'flex',
								overflow: 'hidden',
							}}
						>
							{activeComp ? (
								<Preview
									ref={playerRef}
									composition={activeComp}
								/>
							) : (
								<div
									style={{
										flex: 1,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										color: colors.textMuted,
									}}
								>
									Select a composition
								</div>
							)}
						</div>

						{/* Right panel - hide on tablets if screen is too small */}
						{!isTablet && (
							<>
								{/* Right resize handle */}
								<ResizeHandle direction="horizontal" {...rightDrag} />

								{/* Right panel */}
								<div
									style={{
										width: state.rightPanelWidth,
										minWidth: 200,
										maxWidth: 450,
										flexShrink: 0,
										overflow: 'hidden',
									}}
								>
									<PropsPanel />
								</div>
							</>
						)}
					</div>

					{/* Timeline resize handle */}
					<ResizeHandle direction="vertical" {...timelineDrag} />

					{/* Timeline */}
					<div
						style={{
							height: state.timelineHeight,
							flexShrink: 0,
						}}
					>
						<Timeline playerRef={playerRef} />
					</div>
				</div>

				{/* Overlays */}
				{state.showShortcutsHelp && <KeyboardShortcutsHelp />}
				{state.showQuickSwitcher && <QuickSwitcher />}
				{state.showRenderDialog && <RenderDialog playerRef={playerRef} />}
			</StudioDispatchContext.Provider>
		</StudioStateContext.Provider>
	);
}
