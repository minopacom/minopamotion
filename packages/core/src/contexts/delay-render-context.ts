import { createContext, type MutableRefObject } from 'react';

export interface DelayRenderHandle {
  id: number;
  label: string;
}

export interface DelayRenderContextValue {
  handles: MutableRefObject<DelayRenderHandle[]>;
  addHandle: (handle: DelayRenderHandle) => void;
  removeHandle: (id: number) => void;
}

export const DelayRenderContext = createContext<DelayRenderContextValue | null>(null);
