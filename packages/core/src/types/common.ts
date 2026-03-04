export type ExtrapolateType = 'extend' | 'clamp' | 'identity';

export interface Easing {
  (t: number): number;
}

export type SpringConfig = {
  damping: number;
  mass: number;
  stiffness: number;
  overshootClamping: boolean;
};
