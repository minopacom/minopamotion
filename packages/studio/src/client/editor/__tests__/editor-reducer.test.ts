import { describe, it, expect } from 'vitest';
import {
	editorReducer,
	createInitialEditorState,
	isEditorAction,
	type EditorState,
} from '../editor-state.js';
import { createTextElement, createSolidElement, createEditorTrack } from '../defaults.js';

function init(): EditorState {
	return createInitialEditorState();
}

function withTrackAndElement(): EditorState {
	let state = init();
	const track = createEditorTrack({ id: 'track-1', name: 'Track 1' });
	state = editorReducer(state, { type: 'ADD_EDITOR_TRACK', track });
	const element = createTextElement('track-1', { id: 'el-1' });
	state = editorReducer(state, { type: 'ADD_ELEMENT', element });
	return state;
}

describe('editorReducer', () => {
	describe('isEditorAction', () => {
		it('recognizes editor action types', () => {
			expect(isEditorAction({ type: 'SET_EDITOR_MODE' })).toBe(true);
			expect(isEditorAction({ type: 'ADD_ELEMENT' })).toBe(true);
			expect(isEditorAction({ type: 'HISTORY_UNDO' })).toBe(true);
		});

		it('rejects non-editor action types', () => {
			expect(isEditorAction({ type: 'SET_FRAME' })).toBe(false);
			expect(isEditorAction({ type: 'TOGGLE_PLAY' })).toBe(false);
		});
	});

	describe('SET_EDITOR_MODE', () => {
		it('enables editor mode', () => {
			const state = editorReducer(init(), {
				type: 'SET_EDITOR_MODE',
				enabled: true,
			});
			expect(state.editorMode).toBe(true);
		});

		it('disables editor mode', () => {
			let state = init();
			state = editorReducer(state, { type: 'SET_EDITOR_MODE', enabled: true });
			state = editorReducer(state, { type: 'SET_EDITOR_MODE', enabled: false });
			expect(state.editorMode).toBe(false);
		});
	});

	describe('ADD_ELEMENT', () => {
		it('adds an element to the scene', () => {
			const state = withTrackAndElement();
			expect(state.editorScene.elements).toHaveLength(1);
			expect(state.editorScene.elements[0].id).toBe('el-1');
		});
	});

	describe('UPDATE_ELEMENT', () => {
		it('updates element properties', () => {
			let state = withTrackAndElement();
			state = editorReducer(state, {
				type: 'UPDATE_ELEMENT',
				id: 'el-1',
				updates: { name: 'Updated Text' },
			});
			expect(state.editorScene.elements[0].name).toBe('Updated Text');
		});
	});

	describe('REMOVE_ELEMENTS', () => {
		it('removes elements by ids', () => {
			let state = withTrackAndElement();
			state = editorReducer(state, {
				type: 'REMOVE_ELEMENTS',
				ids: ['el-1'],
			});
			expect(state.editorScene.elements).toHaveLength(0);
		});

		it('clears selection for removed elements', () => {
			let state = withTrackAndElement();
			state = editorReducer(state, {
				type: 'SELECT_ELEMENTS',
				ids: ['el-1'],
			});
			state = editorReducer(state, {
				type: 'REMOVE_ELEMENTS',
				ids: ['el-1'],
			});
			expect(state.selectedElementIds).toHaveLength(0);
		});
	});

	describe('MOVE_ELEMENT', () => {
		it('moves element to new position', () => {
			let state = withTrackAndElement();
			state = editorReducer(state, {
				type: 'MOVE_ELEMENT',
				id: 'el-1',
				x: 100,
				y: 200,
			});
			expect(state.editorScene.elements[0].transform.x).toBe(100);
			expect(state.editorScene.elements[0].transform.y).toBe(200);
		});
	});

	describe('RESIZE_ELEMENT', () => {
		it('updates transform partially', () => {
			let state = withTrackAndElement();
			state = editorReducer(state, {
				type: 'RESIZE_ELEMENT',
				id: 'el-1',
				transform: { width: 500, height: 300 },
			});
			expect(state.editorScene.elements[0].transform.width).toBe(500);
			expect(state.editorScene.elements[0].transform.height).toBe(300);
		});
	});

	describe('REORDER_ELEMENT', () => {
		it('changes element timing', () => {
			let state = withTrackAndElement();
			state = editorReducer(state, {
				type: 'REORDER_ELEMENT',
				id: 'el-1',
				from: 30,
				durationInFrames: 90,
			});
			expect(state.editorScene.elements[0].from).toBe(30);
			expect(state.editorScene.elements[0].durationInFrames).toBe(90);
		});

		it('clamps from to 0', () => {
			let state = withTrackAndElement();
			state = editorReducer(state, {
				type: 'REORDER_ELEMENT',
				id: 'el-1',
				from: -10,
				durationInFrames: 100,
			});
			expect(state.editorScene.elements[0].from).toBe(0);
		});

		it('clamps durationInFrames to 1', () => {
			let state = withTrackAndElement();
			state = editorReducer(state, {
				type: 'REORDER_ELEMENT',
				id: 'el-1',
				from: 0,
				durationInFrames: -5,
			});
			expect(state.editorScene.elements[0].durationInFrames).toBe(1);
		});
	});

	describe('SELECT_ELEMENTS / DESELECT_ALL', () => {
		it('selects elements', () => {
			let state = withTrackAndElement();
			state = editorReducer(state, {
				type: 'SELECT_ELEMENTS',
				ids: ['el-1'],
			});
			expect(state.selectedElementIds).toEqual(['el-1']);
		});

		it('replaces selection by default', () => {
			let state = withTrackAndElement();
			const el2 = createSolidElement('track-1', { id: 'el-2' });
			state = editorReducer(state, { type: 'ADD_ELEMENT', element: el2 });
			state = editorReducer(state, {
				type: 'SELECT_ELEMENTS',
				ids: ['el-1'],
			});
			state = editorReducer(state, {
				type: 'SELECT_ELEMENTS',
				ids: ['el-2'],
			});
			expect(state.selectedElementIds).toEqual(['el-2']);
		});

		it('appends to selection', () => {
			let state = withTrackAndElement();
			const el2 = createSolidElement('track-1', { id: 'el-2' });
			state = editorReducer(state, { type: 'ADD_ELEMENT', element: el2 });
			state = editorReducer(state, {
				type: 'SELECT_ELEMENTS',
				ids: ['el-1'],
			});
			state = editorReducer(state, {
				type: 'SELECT_ELEMENTS',
				ids: ['el-2'],
				append: true,
			});
			expect(state.selectedElementIds).toContain('el-1');
			expect(state.selectedElementIds).toContain('el-2');
		});

		it('deselects all', () => {
			let state = withTrackAndElement();
			state = editorReducer(state, {
				type: 'SELECT_ELEMENTS',
				ids: ['el-1'],
			});
			state = editorReducer(state, { type: 'DESELECT_ALL' });
			expect(state.selectedElementIds).toHaveLength(0);
		});
	});

	describe('NUDGE_ELEMENTS', () => {
		it('nudges elements by delta', () => {
			let state = withTrackAndElement();
			const origX = state.editorScene.elements[0].transform.x;
			const origY = state.editorScene.elements[0].transform.y;
			state = editorReducer(state, {
				type: 'NUDGE_ELEMENTS',
				ids: ['el-1'],
				dx: 5,
				dy: -3,
			});
			expect(state.editorScene.elements[0].transform.x).toBe(origX + 5);
			expect(state.editorScene.elements[0].transform.y).toBe(origY - 3);
		});
	});

	describe('tracks', () => {
		it('adds a track', () => {
			let state = init();
			const track = createEditorTrack({ id: 't1', name: 'Track' });
			state = editorReducer(state, { type: 'ADD_EDITOR_TRACK', track });
			expect(state.editorScene.tracks).toHaveLength(1);
		});

		it('removes track and its elements', () => {
			let state = withTrackAndElement();
			state = editorReducer(state, {
				type: 'REMOVE_EDITOR_TRACK',
				trackId: 'track-1',
			});
			expect(state.editorScene.tracks).toHaveLength(0);
			expect(state.editorScene.elements).toHaveLength(0);
		});

		it('toggles track visibility', () => {
			let state = withTrackAndElement();
			expect(state.editorScene.tracks[0].visible).toBe(true);
			state = editorReducer(state, {
				type: 'TOGGLE_TRACK_VISIBILITY',
				trackId: 'track-1',
			});
			expect(state.editorScene.tracks[0].visible).toBe(false);
		});

		it('toggles track lock', () => {
			let state = withTrackAndElement();
			expect(state.editorScene.tracks[0].locked).toBe(false);
			state = editorReducer(state, {
				type: 'TOGGLE_TRACK_LOCK',
				trackId: 'track-1',
			});
			expect(state.editorScene.tracks[0].locked).toBe(true);
		});
	});

	describe('history', () => {
		it('commits and undoes', () => {
			let state = withTrackAndElement();
			state = editorReducer(state, { type: 'HISTORY_COMMIT' });

			state = editorReducer(state, {
				type: 'MOVE_ELEMENT',
				id: 'el-1',
				x: 999,
				y: 999,
			});
			state = editorReducer(state, { type: 'HISTORY_COMMIT' });

			expect(state.editorScene.elements[0].transform.x).toBe(999);

			state = editorReducer(state, { type: 'HISTORY_UNDO' });
			expect(state.editorScene.elements[0].transform.x).toBe(0);
		});

		it('redoes after undo', () => {
			let state = withTrackAndElement();
			state = editorReducer(state, { type: 'HISTORY_COMMIT' });
			state = editorReducer(state, {
				type: 'MOVE_ELEMENT',
				id: 'el-1',
				x: 500,
				y: 500,
			});
			state = editorReducer(state, { type: 'HISTORY_COMMIT' });
			state = editorReducer(state, { type: 'HISTORY_UNDO' });
			state = editorReducer(state, { type: 'HISTORY_REDO' });
			expect(state.editorScene.elements[0].transform.x).toBe(500);
		});

		it('clears selection on undo/redo', () => {
			let state = withTrackAndElement();
			state = editorReducer(state, { type: 'HISTORY_COMMIT' });
			state = editorReducer(state, {
				type: 'SELECT_ELEMENTS',
				ids: ['el-1'],
			});
			state = editorReducer(state, { type: 'HISTORY_COMMIT' });
			state = editorReducer(state, { type: 'HISTORY_UNDO' });
			expect(state.selectedElementIds).toHaveLength(0);
		});

		it('does nothing when nothing to undo', () => {
			const state = init();
			const result = editorReducer(state, { type: 'HISTORY_UNDO' });
			expect(result).toBe(state);
		});

		it('does nothing when nothing to redo', () => {
			const state = init();
			const result = editorReducer(state, { type: 'HISTORY_REDO' });
			expect(result).toBe(state);
		});
	});
});
