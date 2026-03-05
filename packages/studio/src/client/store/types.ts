import type { TComposition } from '@minopamotion/core';
import type { EditorState, EditorAction } from '../editor/editor-state.js';

export interface TrackDefinition {
	id: string;
	label: string;
	from: number;
	durationInFrames: number;
	color?: string;
}

export interface StudioState extends EditorState {
	compositions: TComposition[];
	selectedCompositionId: string | null;
	inputProps: Record<string, unknown>;
	currentFrame: number;
	playing: boolean;
	loop: boolean;
	muted: boolean;
	volume: number;
	playbackRate: number;
	previewZoom: number;
	canvasZoom: number;
	canvasZoomFitToScreen: boolean;
	showCheckerboard: boolean;
	inPoint: number | null;
	outPoint: number | null;
	timelineZoom: number;
	leftPanelWidth: number;
	rightPanelWidth: number;
	timelineHeight: number;
	propsMode: 'smart' | 'json';
	showShortcutsHelp: boolean;
	showQuickSwitcher: boolean;
	showRenderDialog: boolean;
	tracks: TrackDefinition[];
	snappingEnabled: boolean;
}

export type StudioAction =
	| EditorAction
	| { type: 'SELECT_COMPOSITION'; id: string }
	| { type: 'SET_COMPOSITIONS'; compositions: TComposition[] }
	| { type: 'SET_INPUT_PROPS'; props: Record<string, unknown> }
	| { type: 'UPDATE_INPUT_PROP'; key: string; value: unknown }
	| { type: 'RESET_INPUT_PROP'; key: string }
	| { type: 'SET_FRAME'; frame: number }
	| { type: 'STEP_FRAME'; delta: number }
	| { type: 'GO_TO_START' }
	| { type: 'GO_TO_END' }
	| { type: 'SET_PLAYING'; playing: boolean }
	| { type: 'TOGGLE_PLAY' }
	| { type: 'SET_LOOP'; loop: boolean }
	| { type: 'TOGGLE_LOOP' }
	| { type: 'SET_MUTED'; muted: boolean }
	| { type: 'TOGGLE_MUTE' }
	| { type: 'SET_VOLUME'; volume: number }
	| { type: 'SET_PLAYBACK_RATE'; rate: number }
	| { type: 'SET_PREVIEW_ZOOM'; zoom: number }
	| { type: 'SET_CANVAS_ZOOM'; zoom: number }
	| { type: 'CANVAS_ZOOM_IN' }
	| { type: 'CANVAS_ZOOM_OUT' }
	| { type: 'CANVAS_ZOOM_RESET' }
	| { type: 'CANVAS_ZOOM_FIT' }
	| { type: 'TOGGLE_CHECKERBOARD' }
	| { type: 'SET_IN_POINT'; frame: number }
	| { type: 'SET_OUT_POINT'; frame: number }
	| { type: 'CLEAR_IN_OUT' }
	| { type: 'SET_TIMELINE_ZOOM'; zoom: number }
	| { type: 'SET_LEFT_PANEL_WIDTH'; width: number }
	| { type: 'SET_RIGHT_PANEL_WIDTH'; width: number }
	| { type: 'SET_TIMELINE_HEIGHT'; height: number }
	| { type: 'SET_PROPS_MODE'; mode: 'smart' | 'json' }
	| { type: 'SHOW_SHORTCUTS_HELP'; show: boolean }
	| { type: 'SHOW_QUICK_SWITCHER'; show: boolean }
	| { type: 'SHOW_RENDER_DIALOG'; show: boolean }
	| { type: 'SET_TRACKS'; tracks: TrackDefinition[] }
	| { type: 'TOGGLE_SNAPPING' };
