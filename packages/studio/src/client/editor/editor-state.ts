import type {
	EditorScene,
	EditorElement,
	EditorTrack,
	Transform,
	SceneSettings,
	Asset,
	Transition,
	TimelineTransitionItem,
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
			trackId?: string;
	  }
	| { type: 'SELECT_ELEMENTS'; ids: string[]; append?: boolean }
	| { type: 'SELECT_ALL_ELEMENTS' }
	| { type: 'DESELECT_ALL' }
	| { type: 'DUPLICATE_ELEMENTS' }
	| { type: 'ADD_EDITOR_TRACK'; track: EditorTrack }
	| { type: 'REMOVE_EDITOR_TRACK'; trackId: string }
	| { type: 'RENAME_EDITOR_TRACK'; trackId: string; name: string }
	| { type: 'REORDER_TRACKS'; fromIndex: number; toIndex: number }
	| { type: 'TOGGLE_TRACK_VISIBILITY'; trackId: string }
	| { type: 'TOGGLE_TRACK_LOCK'; trackId: string }
	| { type: 'TOGGLE_TRACK_MUTE'; trackId: string }
	| { type: 'UPDATE_ELEMENT_TRANSITION_IN'; id: string; transition: Transition | null }
	| { type: 'UPDATE_ELEMENT_TRANSITION_OUT'; id: string; transition: Transition | null }
	| { type: 'ADD_TIMELINE_TRANSITION'; transition: TimelineTransitionItem }
	| { type: 'UPDATE_TIMELINE_TRANSITION'; id: string; updates: Partial<TimelineTransitionItem> }
	| { type: 'REMOVE_TIMELINE_TRANSITION'; id: string }
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
				durationInFrames: 900, // 30 seconds at 30fps (was 10 seconds)
			},
			elements: [],
			tracks: [],
			assets: [],
			timelineTransitions: [],
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
		'SELECT_ALL_ELEMENTS',
		'DESELECT_ALL',
		'DUPLICATE_ELEMENTS',
		'ADD_EDITOR_TRACK',
		'REMOVE_EDITOR_TRACK',
		'RENAME_EDITOR_TRACK',
		'REORDER_TRACKS',
		'TOGGLE_TRACK_VISIBILITY',
		'TOGGLE_TRACK_LOCK',
		'TOGGLE_TRACK_MUTE',
		'UPDATE_ELEMENT_TRANSITION_IN',
		'UPDATE_ELEMENT_TRANSITION_OUT',
		'ADD_TIMELINE_TRANSITION',
		'UPDATE_TIMELINE_TRANSITION',
		'REMOVE_TIMELINE_TRANSITION',
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
			let elements = state.editorScene.elements.filter(
				(el) => !idsToRemove.has(el.id),
			);

			// Ripple edit: Close gaps by shifting elements after the deleted ones
			if ('rippleEditEnabled' in state && state.rippleEditEnabled) {
				// Group removed elements by track
				const removedByTrack = new Map<string, Array<{ from: number; to: number }>>();
				state.editorScene.elements.forEach((el) => {
					if (idsToRemove.has(el.id)) {
						const gaps = removedByTrack.get(el.trackId) || [];
						gaps.push({ from: el.from, to: el.from + el.durationInFrames });
						removedByTrack.set(el.trackId, gaps);
					}
				});

				// For each track, shift elements after removed ones
				removedByTrack.forEach((gaps, trackId) => {
					// Sort gaps by start frame
					gaps.sort((a, b) => a.from - b.from);

					// For each element on this track, calculate how much to shift it
					elements = elements.map((el) => {
						if (el.trackId !== trackId) return el;

						// Sum up all gap durations that are before this element
						const shift = gaps.reduce((total, gap) => {
							if (gap.to <= el.from) {
								return total + (gap.to - gap.from);
							}
							return total;
						}, 0);

						if (shift > 0) {
							return { ...el, from: Math.max(0, el.from - shift) };
						}
						return el;
					});
				});
			}

			return {
				...state,
				editorScene: {
					...state.editorScene,
					elements,
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

		case 'REORDER_ELEMENT': {
			const element = state.editorScene.elements.find((el) => el.id === action.id);
			if (!element) return state;

			// Check if we should use insert mode (push clips forward)
			const useInsertMode = 'insertMode' in state && state.insertMode;
			const targetTrackId = action.trackId ?? element.trackId;
			const isChangingTrack = targetTrackId !== element.trackId;
			const isMovingForward = action.from > element.from;

			let elements = updateElement(
				state.editorScene.elements,
				action.id,
				(el) => ({
					...el,
					from: Math.max(0, action.from),
					durationInFrames: Math.max(1, action.durationInFrames),
				...(action.trackId ? { trackId: action.trackId } : {}),
				}),
			);

			// Insert mode: Push overlapping clips forward
			if (useInsertMode && (isChangingTrack || !isMovingForward)) {
				const movedElement = elements.find((el) => el.id === action.id)!;
				const insertStart = movedElement.from;
				const insertEnd = movedElement.from + movedElement.durationInFrames;

				elements = elements.map((el) => {
					// Don't shift the element being moved
					if (el.id === action.id) return el;
					// Only shift elements on the same track
					if (el.trackId !== targetTrackId) return el;

					// If element overlaps with insert range, push it forward
					const elEnd = el.from + el.durationInFrames;
					if (el.from < insertEnd && elEnd > insertStart) {
						// Push element to after the inserted element
						return { ...el, from: insertEnd };
					}
					return el;
				});
			}

			return {
				...state,
				editorScene: {
					...state.editorScene,
					elements,
				},
			};
		}

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

		case 'SELECT_ALL_ELEMENTS':
			return {
				...state,
				selectedElementIds: state.editorScene.elements.map((el) => el.id),
			};

		case 'DESELECT_ALL':
			return { ...state, selectedElementIds: [] };

		case 'DUPLICATE_ELEMENTS': {
			const selectedElements = state.editorScene.elements.filter((el) =>
				state.selectedElementIds.includes(el.id),
			);
			const duplicatedElements = selectedElements.map((el) => {
				const id = `el-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
				return {
					...el,
					id,
					name: `${el.name} (Copy)`,
					from: el.from + 30, // Offset by 30 frames
					transform: {
						...el.transform,
						x: el.transform.x + 20, // Offset by 20px
						y: el.transform.y + 20,
					},
				};
			});
			return {
				...state,
				editorScene: {
					...state.editorScene,
					elements: [...state.editorScene.elements, ...duplicatedElements],
				},
				selectedElementIds: duplicatedElements.map((el) => el.id),
			};
		}

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

		case 'TOGGLE_TRACK_MUTE':
			return {
				...state,
				editorScene: {
					...state.editorScene,
					tracks: state.editorScene.tracks.map((t) =>
						t.id === action.trackId
							? { ...t, muted: !t.muted }
							: t,
					),
				},
			};

		case 'UPDATE_ELEMENT_TRANSITION_IN':
			return {
				...state,
				editorScene: {
					...state.editorScene,
					elements: state.editorScene.elements.map((el) =>
						el.id === action.id
							? { ...el, transitions: { ...el.transitions, in: action.transition } }
							: el,
					),
				},
			};

		case 'UPDATE_ELEMENT_TRANSITION_OUT':
			return {
				...state,
				editorScene: {
					...state.editorScene,
					elements: state.editorScene.elements.map((el) =>
						el.id === action.id
							? { ...el, transitions: { ...el.transitions, out: action.transition } }
							: el,
					),
				},
			};

		case 'ADD_TIMELINE_TRANSITION':
			return {
				...state,
				editorScene: {
					...state.editorScene,
					timelineTransitions: [
						...state.editorScene.timelineTransitions,
						action.transition,
					],
				},
			};

		case 'UPDATE_TIMELINE_TRANSITION':
			return {
				...state,
				editorScene: {
					...state.editorScene,
					timelineTransitions: state.editorScene.timelineTransitions.map((t) =>
						t.id === action.id ? { ...t, ...action.updates } : t,
					),
				},
			};

		case 'REMOVE_TIMELINE_TRANSITION':
			return {
				...state,
				editorScene: {
					...state.editorScene,
					timelineTransitions: state.editorScene.timelineTransitions.filter(
						(t) => t.id !== action.id,
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
