import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import type { PlayerRef } from '@minopamotion/player';
import type { TComposition } from '@minopamotion/core';
import type { TrackDefinition } from './store/types.js';
import { useStudioStore } from './store/useStudioStore.js';
import {
	StudioStateContext,
	StudioDispatchContext,
} from './store/context.js';
import { Toolbar } from './toolbar/Toolbar.js';
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
import { colors } from './utils/colors.js';

export interface StudioProps {
	compositions: TComposition[];
	tracks?: TrackDefinition[];
}

export function Studio({ compositions, tracks }: StudioProps) {
	const [state, dispatch] = useStudioStore(compositions, tracks);
	const playerRef = useRef<PlayerRef>(null);

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
	});

	// Panel resize handlers
	const leftDrag = useDragHandle({
		direction: 'horizontal',
		onDrag: useCallback(
			(delta: number) =>
				dispatch({
					type: 'SET_LEFT_PANEL_WIDTH',
					width: state.leftPanelWidth + delta,
				}),
			[dispatch, state.leftPanelWidth],
		),
	});

	const rightDrag = useDragHandle({
		direction: 'horizontal',
		onDrag: useCallback(
			(delta: number) =>
				dispatch({
					type: 'SET_RIGHT_PANEL_WIDTH',
					width: state.rightPanelWidth - delta,
				}),
			[dispatch, state.rightPanelWidth],
		),
	});

	const timelineDrag = useDragHandle({
		direction: 'vertical',
		onDrag: useCallback(
			(delta: number) =>
				dispatch({
					type: 'SET_TIMELINE_HEIGHT',
					height: state.timelineHeight - delta,
				}),
			[dispatch, state.timelineHeight],
		),
	});

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
					<Toolbar playerRef={playerRef} />

					{/* Main area */}
					<div
						style={{
							display: 'flex',
							flex: 1,
							overflow: 'hidden',
						}}
					>
						{/* Left panel */}
						<div
							style={{
								width: state.leftPanelWidth,
								flexShrink: 0,
								overflow: 'hidden',
							}}
						>
							{state.editorMode ? (
								<AssetLibrary />
							) : (
								<CompositionList />
							)}
						</div>

						{/* Left resize handle */}
						<div
							{...leftDrag}
							style={{
								width: 4,
								cursor: 'col-resize',
								background: colors.border,
								flexShrink: 0,
							}}
						/>

						{/* Preview */}
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

						{/* Right resize handle */}
						<div
							{...rightDrag}
							style={{
								width: 4,
								cursor: 'col-resize',
								background: colors.border,
								flexShrink: 0,
							}}
						/>

						{/* Right panel */}
						<div
							style={{
								width: state.rightPanelWidth,
								flexShrink: 0,
								overflow: 'hidden',
							}}
						>
							<PropsPanel />
						</div>
					</div>

					{/* Timeline resize handle */}
					<div
						{...timelineDrag}
						style={{
							height: 4,
							cursor: 'row-resize',
							background: colors.border,
							flexShrink: 0,
						}}
					/>

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
				{state.showRenderDialog && <RenderDialog />}
			</StudioDispatchContext.Provider>
		</StudioStateContext.Provider>
	);
}
