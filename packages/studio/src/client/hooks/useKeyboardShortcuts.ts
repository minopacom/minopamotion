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
	durationInFrames: number;
}

export function useKeyboardShortcuts({
	dispatch,
	playerRef,
	currentFrame,
	playing,
	editorMode = false,
	selectedElementIds = [],
	durationInFrames,
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
				// Select All: Cmd/Ctrl+A
				if (e.key === 'a' && isMeta) {
					e.preventDefault();
					dispatch({ type: 'SELECT_ALL_ELEMENTS' });
					return;
				}
				// Duplicate: Cmd/Ctrl+D
				if (e.key === 'd' && isMeta && selectedElementIds.length > 0) {
					e.preventDefault();
					dispatch({ type: 'DUPLICATE_ELEMENTS' });
					dispatch({ type: 'HISTORY_COMMIT' });
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

			// J-K-L Shuttle Controls (Professional Video Editor Standard)
			// J = Play backwards, K = Pause, L = Play forwards
			// Hold J/L for faster playback (2x, 4x, 8x)
			if (e.key === 'j' && !isMeta) {
				e.preventDefault();
				// J: Play backwards (or step back if at normal speed)
				if (playing) {
					playerRef.current?.pause();
				}
				// Step backwards
				const stepAmount = e.shiftKey ? 10 : 1;
				dispatch({ type: 'STEP_FRAME', delta: -stepAmount });
				playerRef.current?.seekTo(currentFrame - stepAmount);
				return;
			}

			if (e.key === 'k' && !isMeta) {
				e.preventDefault();
				// K: Pause/Stop
				if (playing) {
					playerRef.current?.pause();
				}
				return;
			}

			if (e.key === 'l' && !isMeta && !editorMode) {
				e.preventDefault();
				// L: Play forward (or step forward if already playing)
				if (!playing) {
					playerRef.current?.play();
				} else {
					// Step forward while playing
					const stepAmount = e.shiftKey ? 10 : 1;
					dispatch({ type: 'STEP_FRAME', delta: stepAmount });
					playerRef.current?.seekTo(currentFrame + stepAmount);
				}
				return;
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

				// Note: 'l' is handled above for J-K-L shuttle controls
				// Loop toggle moved to Shift+L to avoid conflict
				case 'L':
					if (e.shiftKey && !isMeta) {
						e.preventDefault();
						dispatch({ type: 'TOGGLE_LOOP' });
					}
					break;

				case 'PageUp':
					// Jump to previous edit point (element start/end)
					e.preventDefault();
					if (editorMode) {
						// TODO: Implement jump to previous edit point
						// For now, jump back 30 frames
						dispatch({ type: 'STEP_FRAME', delta: -30 });
						playerRef.current?.seekTo(currentFrame - 30);
					}
					break;

				case 'PageDown':
					// Jump to next edit point (element start/end)
					e.preventDefault();
					if (editorMode) {
						// TODO: Implement jump to next edit point
						// For now, jump forward 30 frames
						dispatch({ type: 'STEP_FRAME', delta: 30 });
						playerRef.current?.seekTo(currentFrame + 30);
					}
					break;

				case 'm':
				case 'M':
					if (e.shiftKey) {
						// Shift+M: Toggle snapping
						e.preventDefault();
						dispatch({ type: 'TOGGLE_SNAPPING' });
					} else if (!isMeta) {
						dispatch({ type: 'TOGGLE_MUTE' });
					}
					break;

				case 'r':
				case 'R':
					if (e.shiftKey && !isMeta && editorMode) {
						// Shift+R: Toggle ripple edit mode
						e.preventDefault();
						dispatch({ type: 'TOGGLE_RIPPLE_EDIT' });
					}
					break;

				case 'i':
				case 'I':
					if (e.shiftKey && !isMeta && editorMode) {
						// Shift+I: Toggle insert mode
						e.preventDefault();
						dispatch({ type: 'TOGGLE_INSERT_MODE' });
					} else if (!isMeta && !e.shiftKey) {
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

				case '+':
				case '=':
					if (editorMode) {
						e.preventDefault();
						dispatch({ type: 'CANVAS_ZOOM_IN' });
					}
					break;

				case '-':
				case '_':
					if (editorMode) {
						e.preventDefault();
						dispatch({ type: 'CANVAS_ZOOM_OUT' });
					}
					break;

				case '0':
					if (editorMode && !isMeta) {
						e.preventDefault();
						dispatch({ type: 'CANVAS_ZOOM_RESET' });
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
	}, [dispatch, playerRef, currentFrame, playing, editorMode, selectedElementIds, durationInFrames]);
}
