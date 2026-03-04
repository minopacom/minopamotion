import { createContext } from 'react';
import type { SequenceContextType } from '../types/sequence.js';

export const SequenceContext = createContext<SequenceContextType | null>(null);
