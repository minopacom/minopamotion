import React, { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react';
import type { TComposition, CompositionManagerAction } from '../types/composition.js';

interface CompositionManagerContextType {
  compositions: TComposition[];
  registerComposition: (composition: TComposition) => void;
  unregisterComposition: (id: string) => void;
  currentCompositionId: string | null;
  setCurrentCompositionId: (id: string | null) => void;
}

const CompositionManagerContext = createContext<CompositionManagerContextType>({
  compositions: [],
  registerComposition: () => {},
  unregisterComposition: () => {},
  currentCompositionId: null,
  setCurrentCompositionId: () => {},
});

function compositionsReducer(
  state: TComposition[],
  action: CompositionManagerAction,
): TComposition[] {
  switch (action.type) {
    case 'REGISTER': {
      const existing = state.findIndex((c) => c.id === action.composition.id);
      if (existing >= 0) {
        const next = [...state];
        next[existing] = action.composition;
        return next;
      }
      return [...state, action.composition];
    }
    case 'UNREGISTER':
      return state.filter((c) => c.id !== action.id);
    default:
      return state;
  }
}

export function CompositionManagerProvider({ children }: { children: ReactNode }) {
  const [compositions, dispatch] = useReducer(compositionsReducer, []);
  const [currentCompositionId, setCurrentCompositionId] = React.useState<string | null>(null);

  const registerComposition = useCallback((composition: TComposition) => {
    dispatch({ type: 'REGISTER', composition });
  }, []);

  const unregisterComposition = useCallback((id: string) => {
    dispatch({ type: 'UNREGISTER', id });
  }, []);

  return (
    <CompositionManagerContext.Provider
      value={{
        compositions,
        registerComposition,
        unregisterComposition,
        currentCompositionId,
        setCurrentCompositionId,
      }}
    >
      {children}
    </CompositionManagerContext.Provider>
  );
}

export function useCompositionManager() {
  return useContext(CompositionManagerContext);
}

export { CompositionManagerContext };
