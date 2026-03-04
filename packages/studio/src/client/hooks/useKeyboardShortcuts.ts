import { useEffect } from 'react';
import type { PlayerRef } from '@minopamotion/player';
import type { StudioAction } from '../store/types.js';

interface UseKeyboardShortcutsOptions {
	dispatch: React.Dispatch<StudioAction>;
	playerRef: React.RefObject<PlayerRef | null>;
	currentFrame: number;
	playing: boolean;
	editorMode?: boolean;
	selectedElementIds?: string[];
}

export function useKeyboardShortcuts({
	dispatch,
	playerRef,
	currentFrame,
	playing,
	editorMode = false,
	selectedElementIds = [],
}: UseKeyboardShortcutsOptions) {
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			const target = e.target as HTMLElement;
			if (
				target.tagName === 'INPUT' ||
				target.tagName === 'TEXTAREA' ||
				target.tagName === 'SELECT' ||
				target.isContentEditable
			) {
				return;
			}

			const isMeta = e.metaKey || e.ctrlKey;

			// Editor-specific shortcuts
			if (editorMode) {
				if (e.key === 'z' && isMeta && e.shiftKey) {
					e.preventDefault();
					dispatch({ type: 'HISTORY_REDO' });
					return;
				}
				if (e.key === 'z' && isMeta) {
					e.preventDefault();
					dispatch({ type: 'HISTORY_UNDO' });
					return;
				}
				if (
					(e.key === 'Delete' || e.key === 'Backspace') &&
					selectedElementIds.length > 0
				) {
					e.preventDefault();
					dispatch({
						type: 'REMOVE_ELEMENTS',
						ids: selectedElementIds,
					});
					dispatch({ type: 'HISTORY_COMMIT' });
					return;
				}
				if (
					(e.key === 'ArrowUp' ||
						e.key === 'ArrowDown' ||
						e.key === 'ArrowLeft' ||
						e.key === 'ArrowRight') &&
					selectedElementIds.length > 0 &&
					!isMeta
				) {
					e.preventDefault();
					const nudge = e.shiftKey ? 10 : 1;
					const dx =
						e.key === 'ArrowLeft'
							? -nudge
							: e.key === 'ArrowRight'
								? nudge
								: 0;
					const dy =
						e.key === 'ArrowUp'
							? -nudge
							: e.key === 'ArrowDown'
								? nudge
								: 0;
					dispatch({
						type: 'NUDGE_ELEMENTS',
						ids: selectedElementIds,
						dx,
						dy,
					});
					return;
				}
				if (e.key === 'Escape') {
					dispatch({ type: 'DESELECT_ALL' });
					// Also close overlays (fall through)
				}
				if (e.key === 't' && !isMeta) {
					// Quick-add text - handled by toolbar, dispatch custom
					return;
				}
				if (e.key === 'r' && !isMeta) {
					// Quick-add rect - handled by toolbar, dispatch custom
					return;
				}
			}

			switch (e.key) {
				case ' ':
					e.preventDefault();
					if (playing) {
						playerRef.current?.pause();
					} else {
						playerRef.current?.play();
					}
					break;

				case 'ArrowLeft':
					e.preventDefault();
					if (playing) {
						playerRef.current?.pause();
					}
					dispatch({
						type: 'STEP_FRAME',
						delta: e.shiftKey ? -10 : -1,
					});
					playerRef.current?.seekTo(
						currentFrame + (e.shiftKey ? -10 : -1),
					);
					break;

				case 'ArrowRight':
					e.preventDefault();
					if (playing) {
						playerRef.current?.pause();
					}
					dispatch({
						type: 'STEP_FRAME',
						delta: e.shiftKey ? 10 : 1,
					});
					playerRef.current?.seekTo(
						currentFrame + (e.shiftKey ? 10 : 1),
					);
					break;

				case 'Home':
					e.preventDefault();
					dispatch({ type: 'GO_TO_START' });
					playerRef.current?.seekTo(0);
					break;

				case 'End':
					e.preventDefault();
					dispatch({ type: 'GO_TO_END' });
					break;

				case 'l':
					if (!isMeta) {
						dispatch({ type: 'TOGGLE_LOOP' });
					}
					break;

				case 'm':
					if (!isMeta) {
						dispatch({ type: 'TOGGLE_MUTE' });
					}
					break;

				case 'i':
					if (!isMeta) {
						dispatch({
							type: 'SET_IN_POINT',
							frame: currentFrame,
						});
					}
					break;

				case 'o':
					if (!isMeta) {
						dispatch({
							type: 'SET_OUT_POINT',
							frame: currentFrame,
						});
					}
					break;

				case 'x':
					if (!isMeta) {
						dispatch({ type: 'CLEAR_IN_OUT' });
					}
					break;

				case '?':
					dispatch({ type: 'SHOW_SHORTCUTS_HELP', show: true });
					break;

				case 'k':
					if (isMeta) {
						e.preventDefault();
						dispatch({ type: 'SHOW_QUICK_SWITCHER', show: true });
					}
					break;

				case 'Escape':
					dispatch({ type: 'SHOW_SHORTCUTS_HELP', show: false });
					dispatch({ type: 'SHOW_QUICK_SWITCHER', show: false });
					dispatch({ type: 'SHOW_RENDER_DIALOG', show: false });
					break;
			}
		};

		document.addEventListener('keydown', handler);
		return () => document.removeEventListener('keydown', handler);
	}, [dispatch, playerRef, currentFrame, playing, editorMode, selectedElementIds]);
}
