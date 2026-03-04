import { describe, it, expect } from 'vitest';
import {
	createHistoryState,
	commit,
	undo,
	redo,
	canUndo,
	canRedo,
} from '../history/history.js';
import type { EditorScene } from '../types.js';

function makeScene(elementCount: number = 0): EditorScene {
	return {
		settings: {
			width: 1920,
			height: 1080,
			fps: 30,
			durationInFrames: 300,
		},
		elements: Array.from({ length: elementCount }, (_, i) => ({
			id: `el-${i}`,
			type: 'text' as const,
			name: `Element ${i}`,
			trackId: 'track-1',
			from: 0,
			durationInFrames: 100,
			transform: { x: i * 10, y: 0, width: 100, height: 50, rotation: 0, opacity: 1 },
			text: 'test',
			fontSize: 24,
			fontFamily: 'sans-serif',
			fontWeight: 400,
			color: '#fff',
			textAlign: 'left' as const,
			lineHeight: 1.2,
		})),
		tracks: [{ id: 'track-1', name: 'Track 1', visible: true, locked: false }],
		assets: [],
	};
}

describe('history', () => {
	it('starts with empty history', () => {
		const h = createHistoryState();
		expect(h.entries).toHaveLength(0);
		expect(h.index).toBe(-1);
		expect(canUndo(h)).toBe(false);
		expect(canRedo(h)).toBe(false);
	});

	it('commit adds a snapshot', () => {
		let h = createHistoryState();
		h = commit(h, makeScene(1));
		expect(h.entries).toHaveLength(1);
		expect(h.index).toBe(0);
	});

	it('undo returns previous scene', () => {
		let h = createHistoryState();
		const scene1 = makeScene(1);
		const scene2 = makeScene(2);
		h = commit(h, scene1);
		h = commit(h, scene2);
		expect(canUndo(h)).toBe(true);

		const result = undo(h);
		expect(result.scene).not.toBeNull();
		expect(result.scene!.elements).toHaveLength(1);
		expect(result.history.index).toBe(0);
	});

	it('redo restores undone scene', () => {
		let h = createHistoryState();
		h = commit(h, makeScene(1));
		h = commit(h, makeScene(2));
		const undoResult = undo(h);
		h = undoResult.history;
		expect(canRedo(h)).toBe(true);

		const redoResult = redo(h);
		expect(redoResult.scene).not.toBeNull();
		expect(redoResult.scene!.elements).toHaveLength(2);
	});

	it('undo at start does nothing', () => {
		let h = createHistoryState();
		h = commit(h, makeScene(1));
		const result = undo(h);
		expect(result.scene).toBeNull();
		expect(result.history.index).toBe(0);
	});

	it('redo at end does nothing', () => {
		let h = createHistoryState();
		h = commit(h, makeScene(1));
		const result = redo(h);
		expect(result.scene).toBeNull();
	});

	it('commit after undo discards redo stack', () => {
		let h = createHistoryState();
		h = commit(h, makeScene(1));
		h = commit(h, makeScene(2));
		h = commit(h, makeScene(3));
		h = undo(h).history;
		h = undo(h).history;
		// Now at index 0 (scene with 1 element)
		h = commit(h, makeScene(4));
		expect(h.entries).toHaveLength(2);
		expect(h.index).toBe(1);
		expect(canRedo(h)).toBe(false);
	});

	it('snapshots are deep copies', () => {
		let h = createHistoryState();
		const scene = makeScene(1);
		h = commit(h, scene);
		scene.elements[0].transform.x = 999;
		expect(h.entries[0].elements[0].transform.x).toBe(0);
	});
});
