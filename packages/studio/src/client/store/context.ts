import { createContext, useContext } from 'react';
import type { StudioState, StudioAction } from './types.js';

export const StudioStateContext = createContext<StudioState | null>(null);
export const StudioDispatchContext =
	createContext<React.Dispatch<StudioAction> | null>(null);

export function useStudioState(): StudioState {
	const state = useContext(StudioStateContext);
	if (!state) {
		throw new Error('useStudioState must be used within a StudioProvider');
	}
	return state;
}

export function useStudioDispatch(): React.Dispatch<StudioAction> {
	const dispatch = useContext(StudioDispatchContext);
	if (!dispatch) {
		throw new Error(
			'useStudioDispatch must be used within a StudioProvider',
		);
	}
	return dispatch;
}
