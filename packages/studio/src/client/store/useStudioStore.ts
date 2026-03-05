import { useReducer } from 'react';
import type { TComposition } from '@minopamotion/core';
import type { StudioState, TrackDefinition } from './types.js';
import { studioReducer } from './reducer.js';
import { createInitialEditorState } from '../editor/editor-state.js';

export function createInitialState(
	compositions: TComposition[],
	tracks?: TrackDefinition[],
): StudioState {
	const first = compositions[0] ?? null;

	// Responsive panel widths based on screen size
	const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
	const leftPanelWidth = screenWidth < 1280 ? 200 : 240;
	const rightPanelWidth = screenWidth < 1280 ? 240 : 300;

	return {
		...createInitialEditorState(),
		compositions,
		selectedCompositionId: first?.id ?? null,
		inputProps: first ? { ...first.defaultProps } : {},
		currentFrame: 0,
		playing: false,
		loop: true,
		muted: false,
		volume: 1,
		playbackRate: 1,
		previewZoom: 0,
		canvasZoom: 1, // 1 = 100%
		canvasZoomFitToScreen: true, // Start with fit-to-screen
		showCheckerboard: true, // Show checkerboard by default for better visibility
		inPoint: null,
		outPoint: null,
		timelineZoom: 2.0, // Start zoomed in to allow scrolling and see details (2x container width)
		leftPanelWidth,
		rightPanelWidth,
		timelineHeight: 280, // Increased from 200 for better usability
		propsMode: 'smart',
		showShortcutsHelp: false,
		showQuickSwitcher: false,
		showRenderDialog: false,
		tracks: tracks ?? [],
		snappingEnabled: true, // Enabled by default
	};
}

export function useStudioStore(
	compositions: TComposition[],
	tracks?: TrackDefinition[],
) {
	return useReducer(
		studioReducer,
		{ compositions, tracks },
		({ compositions: comps, tracks: t }) => createInitialState(comps, t),
	);
}
