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
		showCheckerboard: false,
		inPoint: null,
		outPoint: null,
		timelineZoom: 1,
		leftPanelWidth: 240,
		rightPanelWidth: 300,
		timelineHeight: 200,
		propsMode: 'smart',
		showShortcutsHelp: false,
		showQuickSwitcher: false,
		showRenderDialog: false,
		tracks: tracks ?? [],
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
