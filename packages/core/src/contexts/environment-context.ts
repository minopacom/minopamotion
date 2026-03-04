import { createContext } from 'react';

export type Environment = 'rendering' | 'player' | 'studio';

export const EnvironmentContext = createContext<Environment>('player');
