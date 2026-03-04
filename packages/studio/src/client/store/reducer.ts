import type { StudioState, StudioAction } from './types.js';
import {
	isEditorAction,
	editorReducer,
} from '../editor/editor-state.js';

function clampFrame(frame: number, state: StudioState): number {
	const comp = state.compositions.find(
		(c) => c.id === state.selectedCompositionId,
	);
	if (!comp) return 0;
	return Math.max(0, Math.min(frame, comp.durationInFrames - 1));
}

function getSelectedComposition(state: StudioState) {
	return state.compositions.find(
		(c) => c.id === state.selectedCompositionId,
	);
}

export function studioReducer(
	state: StudioState,
	action: StudioAction,
): StudioState {
	if (isEditorAction(action)) {
		return { ...state, ...editorReducer(state, action) };
	}

	switch (action.type) {
		case 'SELECT_COMPOSITION': {
			const comp = state.compositions.find((c) => c.id === action.id);
			if (!comp) return state;
			return {
				...state,
				selectedCompositionId: action.id,
				inputProps: { ...comp.defaultProps },
				currentFrame: 0,
				playing: false,
				inPoint: null,
				outPoint: null,
			};
		}

		case 'SET_COMPOSITIONS':
			return { ...state, compositions: action.compositions };

		case 'SET_INPUT_PROPS':
			return { ...state, inputProps: action.props };

		case 'UPDATE_INPUT_PROP':
			return {
				...state,
				inputProps: { ...state.inputProps, [action.key]: action.value },
			};

		case 'RESET_INPUT_PROP': {
			const comp = getSelectedComposition(state);
			if (!comp) return state;
			const defaultValue = comp.defaultProps[action.key];
			return {
				...state,
				inputProps: { ...state.inputProps, [action.key]: defaultValue },
			};
		}

		case 'SET_FRAME':
			return { ...state, currentFrame: clampFrame(action.frame, state) };

		case 'STEP_FRAME':
			return {
				...state,
				currentFrame: clampFrame(
					state.currentFrame + action.delta,
					state,
				),
			};

		case 'GO_TO_START':
			return {
				...state,
				currentFrame: state.inPoint ?? 0,
			};

		case 'GO_TO_END': {
			const comp = getSelectedComposition(state);
			if (!comp) return state;
			return {
				...state,
				currentFrame: state.outPoint ?? comp.durationInFrames - 1,
			};
		}

		case 'SET_PLAYING':
			return { ...state, playing: action.playing };

		case 'TOGGLE_PLAY':
			return { ...state, playing: !state.playing };

		case 'SET_LOOP':
			return { ...state, loop: action.loop };

		case 'TOGGLE_LOOP':
			return { ...state, loop: !state.loop };

		case 'SET_MUTED':
			return { ...state, muted: action.muted };

		case 'TOGGLE_MUTE':
			return { ...state, muted: !state.muted };

		case 'SET_VOLUME':
			return {
				...state,
				volume: Math.max(0, Math.min(1, action.volume)),
			};

		case 'SET_PLAYBACK_RATE':
			return { ...state, playbackRate: action.rate };

		case 'SET_PREVIEW_ZOOM':
			return { ...state, previewZoom: action.zoom };

		case 'TOGGLE_CHECKERBOARD':
			return { ...state, showCheckerboard: !state.showCheckerboard };

		case 'SET_IN_POINT':
			return {
				...state,
				inPoint: clampFrame(action.frame, state),
			};

		case 'SET_OUT_POINT':
			return {
				...state,
				outPoint: clampFrame(action.frame, state),
			};

		case 'CLEAR_IN_OUT':
			return { ...state, inPoint: null, outPoint: null };

		case 'SET_TIMELINE_ZOOM':
			return {
				...state,
				timelineZoom: Math.max(0.1, Math.min(10, action.zoom)),
			};

		case 'SET_LEFT_PANEL_WIDTH':
			return {
				...state,
				leftPanelWidth: Math.max(150, Math.min(500, action.width)),
			};

		case 'SET_RIGHT_PANEL_WIDTH':
			return {
				...state,
				rightPanelWidth: Math.max(200, Math.min(600, action.width)),
			};

		case 'SET_TIMELINE_HEIGHT':
			return {
				...state,
				timelineHeight: Math.max(100, Math.min(500, action.height)),
			};

		case 'SET_PROPS_MODE':
			return { ...state, propsMode: action.mode };

		case 'SHOW_SHORTCUTS_HELP':
			return { ...state, showShortcutsHelp: action.show };

		case 'SHOW_QUICK_SWITCHER':
			return { ...state, showQuickSwitcher: action.show };

		case 'SHOW_RENDER_DIALOG':
			return { ...state, showRenderDialog: action.show };

		case 'SET_TRACKS':
			return { ...state, tracks: action.tracks };

		default:
			return state;
	}
}
