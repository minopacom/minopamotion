type PlayerEventMap = {
  play: void;
  pause: void;
  seeked: number;
  ended: void;
  error: Error;
  frameupdate: number;
  ratechange: number;
};

type Listener<T> = (data: T) => void;

export class PlayerEmitter {
  private listeners = new Map<string, Set<Listener<unknown>>>();

  on<K extends keyof PlayerEventMap>(event: K, listener: Listener<PlayerEventMap[K]>): () => void {
    const key = event as string;
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    const set = this.listeners.get(key)!;
    set.add(listener as Listener<unknown>);
    return () => set.delete(listener as Listener<unknown>);
  }

  off<K extends keyof PlayerEventMap>(event: K, listener: Listener<PlayerEventMap[K]>): void {
    this.listeners.get(event as string)?.delete(listener as Listener<unknown>);
  }

  emit<K extends keyof PlayerEventMap>(event: K, data: PlayerEventMap[K]): void {
    this.listeners.get(event as string)?.forEach((fn) => fn(data));
  }

  removeAllListeners(): void {
    this.listeners.clear();
  }
}

export type { PlayerEventMap };
