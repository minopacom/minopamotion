import { useStudioState } from '../store/context.js';
import type { EditorScene, EditorElement } from './types.js';

export function useEditorMode(): boolean {
	return useStudioState().editorMode;
}

export function useEditorScene(): EditorScene {
	return useStudioState().editorScene;
}

export function useSelectedElementIds(): string[] {
	return useStudioState().selectedElementIds;
}

export function useSelectedElements(): EditorElement[] {
	const { editorScene, selectedElementIds } = useStudioState();
	return editorScene.elements.filter((el) =>
		selectedElementIds.includes(el.id),
	);
}
