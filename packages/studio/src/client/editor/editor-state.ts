import type {
	EditorScene,
	EditorElement,
	EditorTrack,
	Transform,
	SceneSettings,
	Asset,
} from './types.js';

export type EditorAction =
	| { type: 'SET_EDITOR_MODE'; enabled: boolean }
	| { type: 'UPDATE_SCENE_SETTINGS'; settings: Partial<SceneSettings> }
	| { type: 'ADD_ASSET'; asset: Asset }
	| { type: 'REMOVE_ASSET'; assetId: string }
	| { type: 'ADD_ELEMENT'; element: EditorElement }
	| { type: 'UPDATE_ELEMENT'; id: string; updates: Partial<EditorElement> }
	| { type: 'REMOVE_ELEMENTS'; ids: string[] }
	| {
			type: 'MOVE_ELEMENT';
			id: string;
			x: number;
			y: number;
	  }
	| {
			type: 'RESIZE_ELEMENT';
			id: string;
			transform: Partial<Transform>;
	  }
	| {
			type: 'REORDER_ELEMENT';
			id: string;
			from: number;
			durationInFrames: number;
	  }
	| { type: 'SELECT_ELEMENTS'; ids: string[]; append?: boolean }
	| { type: 'DESELECT_ALL' }
	| { type: 'ADD_EDITOR_TRACK'; track: EditorTrack }
	| { type: 'REMOVE_EDITOR_TRACK'; trackId: string }
	| { type: 'RENAME_EDITOR_TRACK'; trackId: string; name: string }
	| { type: 'REORDER_TRACKS'; fromIndex: number; toIndex: number }
	| { type: 'TOGGLE_TRACK_VISIBILITY'; trackId: string }
	| { type: 'TOGGLE_TRACK_LOCK'; trackId: string }
	| { type: 'HISTORY_COMMIT' }
	| { type: 'NUDGE_ELEMENTS'; ids: string[]; dx: number; dy: number }
	| { type: 'HISTORY_UNDO' }
	| { type: 'HISTORY_REDO' };

export interface EditorState {
	editorMode: boolean;
	editorScene: EditorScene;
	selectedElementIds: string[];
	editorHistory: EditorScene[];
	editorHistoryIndex: number;
}

const MAX_HISTORY = 100;

export function createInitialEditorState(): EditorState {
	return {
		editorMode: false,
		editorScene: {
			settings: {
				width: 1920,
				height: 1080,
				fps: 30,
				durationInFrames: 300,
			},
			elements: [],
			tracks: [],
			assets: [],
		},
		selectedElementIds: [],
		editorHistory: [],
		editorHistoryIndex: -1,
	};
}

function cloneScene(scene: EditorScene): EditorScene {
	return JSON.parse(JSON.stringify(scene));
}

export function isEditorAction(action: { type: string }): action is EditorAction {
	return [
		'SET_EDITOR_MODE',
		'UPDATE_SCENE_SETTINGS',
		'ADD_ASSET',
		'REMOVE_ASSET',
		'ADD_ELEMENT',
		'UPDATE_ELEMENT',
		'REMOVE_ELEMENTS',
		'MOVE_ELEMENT',
		'RESIZE_ELEMENT',
		'REORDER_ELEMENT',
		'SELECT_ELEMENTS',
		'DESELECT_ALL',
		'ADD_EDITOR_TRACK',
		'REMOVE_EDITOR_TRACK',
		'RENAME_EDITOR_TRACK',
		'REORDER_TRACKS',
		'TOGGLE_TRACK_VISIBILITY',
		'TOGGLE_TRACK_LOCK',
		'NUDGE_ELEMENTS',
		'HISTORY_COMMIT',
		'HISTORY_UNDO',
		'HISTORY_REDO',
	].includes(action.type);
}

function updateElement(
	elements: EditorElement[],
	id: string,
	updater: (el: EditorElement) => EditorElement,
): EditorElement[] {
	return elements.map((el) => (el.id === id ? updater(el) : el));
}

export function editorReducer(
	state: EditorState,
	action: EditorAction,
): EditorState {
	switch (action.type) {
		case 'SET_EDITOR_MODE':
			return { ...state, editorMode: action.enabled };

		case 'UPDATE_SCENE_SETTINGS':
			return {
				...state,
				editorScene: {
					...state.editorScene,
					settings: {
						...state.editorScene.settings,
						...action.settings,
					},
				},
			};

		case 'ADD_ASSET':
			return {
				...state,
				editorScene: {
					...state.editorScene,
					assets: [...state.editorScene.assets, action.asset],
				},
			};

		case 'REMOVE_ASSET':
			return {
				...state,
				editorScene: {
					...state.editorScene,
					assets: state.editorScene.assets.filter(
						(a) => a.id !== action.assetId,
					),
				},
			};

		case 'ADD_ELEMENT':
			return {
				...state,
				editorScene: {
					...state.editorScene,
					elements: [...state.editorScene.elements, action.element],
				},
			};

		case 'UPDATE_ELEMENT':
			return {
				...state,
				editorScene: {
					...state.editorScene,
					elements: updateElement(
						state.editorScene.elements,
						action.id,
						(el) => ({ ...el, ...action.updates } as EditorElement),
					),
				},
			};

		case 'REMOVE_ELEMENTS': {
			const idsToRemove = new Set(action.ids);
			return {
				...state,
				editorScene: {
					...state.editorScene,
					elements: state.editorScene.elements.filter(
						(el) => !idsToRemove.has(el.id),
					),
				},
				selectedElementIds: state.selectedElementIds.filter(
					(id) => !idsToRemove.has(id),
				),
			};
		}

		case 'MOVE_ELEMENT':
			return {
				...state,
				editorScene: {
					...state.editorScene,
					elements: updateElement(
						state.editorScene.elements,
						action.id,
						(el) => ({
							...el,
							transform: {
								...el.transform,
								x: action.x,
								y: action.y,
							},
						}),
					),
				},
			};

		case 'RESIZE_ELEMENT':
			return {
				...state,
				editorScene: {
					...state.editorScene,
					elements: updateElement(
						state.editorScene.elements,
						action.id,
						(el) => ({
							...el,
							transform: {
								...el.transform,
								...action.transform,
							},
						}),
					),
				},
			};

		case 'REORDER_ELEMENT':
			return {
				...state,
				editorScene: {
					...state.editorScene,
					elements: updateElement(
						state.editorScene.elements,
						action.id,
						(el) => ({
							...el,
							from: Math.max(0, action.from),
							durationInFrames: Math.max(1, action.durationInFrames),
						}),
					),
				},
			};

		case 'SELECT_ELEMENTS': {
			if (action.append) {
				const merged = new Set([
					...state.selectedElementIds,
					...action.ids,
				]);
				return {
					...state,
					selectedElementIds: Array.from(merged),
				};
			}
			return { ...state, selectedElementIds: action.ids };
		}

		case 'DESELECT_ALL':
			return { ...state, selectedElementIds: [] };

		case 'ADD_EDITOR_TRACK':
			return {
				...state,
				editorScene: {
					...state.editorScene,
					tracks: [...state.editorScene.tracks, action.track],
				},
			};

		case 'REMOVE_EDITOR_TRACK':
			return {
				...state,
				editorScene: {
					...state.editorScene,
					tracks: state.editorScene.tracks.filter(
						(t) => t.id !== action.trackId,
					),
					elements: state.editorScene.elements.filter(
						(el) => el.trackId !== action.trackId,
					),
				},
			};

		case 'RENAME_EDITOR_TRACK':
			return {
				...state,
				editorScene: {
					...state.editorScene,
					tracks: state.editorScene.tracks.map((t) =>
						t.id === action.trackId
							? { ...t, name: action.name }
							: t,
					),
				},
			};

		case 'REORDER_TRACKS': {
			const tracks = [...state.editorScene.tracks];
			const [moved] = tracks.splice(action.fromIndex, 1);
			tracks.splice(action.toIndex, 0, moved);
			return {
				...state,
				editorScene: {
					...state.editorScene,
					tracks,
				},
			};
		}

		case 'TOGGLE_TRACK_VISIBILITY':
			return {
				...state,
				editorScene: {
					...state.editorScene,
					tracks: state.editorScene.tracks.map((t) =>
						t.id === action.trackId
							? { ...t, visible: !t.visible }
							: t,
					),
				},
			};

		case 'TOGGLE_TRACK_LOCK':
			return {
				...state,
				editorScene: {
					...state.editorScene,
					tracks: state.editorScene.tracks.map((t) =>
						t.id === action.trackId
							? { ...t, locked: !t.locked }
							: t,
					),
				},
			};

		case 'NUDGE_ELEMENTS': {
			const idsToNudge = new Set(action.ids);
			return {
				...state,
				editorScene: {
					...state.editorScene,
					elements: state.editorScene.elements.map((el) =>
						idsToNudge.has(el.id)
							? {
									...el,
									transform: {
										...el.transform,
										x: el.transform.x + action.dx,
										y: el.transform.y + action.dy,
									},
								}
							: el,
					),
				},
			};
		}

		case 'HISTORY_COMMIT': {
			const snapshot = cloneScene(state.editorScene);
			const newHistory = state.editorHistory
				.slice(0, state.editorHistoryIndex + 1)
				.concat(snapshot)
				.slice(-MAX_HISTORY);
			return {
				...state,
				editorHistory: newHistory,
				editorHistoryIndex: newHistory.length - 1,
			};
		}

		case 'HISTORY_UNDO': {
			if (state.editorHistoryIndex <= 0) return state;
			const newIndex = state.editorHistoryIndex - 1;
			return {
				...state,
				editorScene: cloneScene(state.editorHistory[newIndex]),
				editorHistoryIndex: newIndex,
				selectedElementIds: [],
			};
		}

		case 'HISTORY_REDO': {
			if (
				state.editorHistoryIndex >=
				state.editorHistory.length - 1
			)
				return state;
			const newIndex = state.editorHistoryIndex + 1;
			return {
				...state,
				editorScene: cloneScene(state.editorHistory[newIndex]),
				editorHistoryIndex: newIndex,
				selectedElementIds: [],
			};
		}

		default:
			return state;
	}
}
