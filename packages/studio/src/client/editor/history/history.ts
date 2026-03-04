import type { EditorScene } from '../types.js';

const MAX_HISTORY = 100;

export interface HistoryState {
	entries: EditorScene[];
	index: number;
}

export function createHistoryState(): HistoryState {
	return { entries: [], index: -1 };
}

function cloneScene(scene: EditorScene): EditorScene {
	return JSON.parse(JSON.stringify(scene));
}

export function commit(
	history: HistoryState,
	scene: EditorScene,
): HistoryState {
	const snapshot = cloneScene(scene);
	const newEntries = history.entries
		.slice(0, history.index + 1)
		.concat(snapshot)
		.slice(-MAX_HISTORY);
	return {
		entries: newEntries,
		index: newEntries.length - 1,
	};
}

export function undo(history: HistoryState): {
	history: HistoryState;
	scene: EditorScene | null;
} {
	if (history.index <= 0) {
		return { history, scene: null };
	}
	const newIndex = history.index - 1;
	return {
		history: { ...history, index: newIndex },
		scene: cloneScene(history.entries[newIndex]),
	};
}

export function redo(history: HistoryState): {
	history: HistoryState;
	scene: EditorScene | null;
} {
	if (history.index >= history.entries.length - 1) {
		return { history, scene: null };
	}
	const newIndex = history.index + 1;
	return {
		history: { ...history, index: newIndex },
		scene: cloneScene(history.entries[newIndex]),
	};
}

export function canUndo(history: HistoryState): boolean {
	return history.index > 0;
}

export function canRedo(history: HistoryState): boolean {
	return history.index < history.entries.length - 1;
}
