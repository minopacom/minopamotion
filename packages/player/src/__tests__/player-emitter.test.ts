import { describe, it, expect, vi } from 'vitest';
import { PlayerEmitter } from '../events/player-emitter.js';

describe('PlayerEmitter', () => {
  it('emits and receives events', () => {
    const emitter = new PlayerEmitter();
    const fn = vi.fn();
    emitter.on('play', fn);
    emitter.emit('play', undefined as never);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('returns unsubscribe function', () => {
    const emitter = new PlayerEmitter();
    const fn = vi.fn();
    const unsub = emitter.on('play', fn);
    unsub();
    emitter.emit('play', undefined as never);
    expect(fn).not.toHaveBeenCalled();
  });

  it('off removes listener', () => {
    const emitter = new PlayerEmitter();
    const fn = vi.fn();
    emitter.on('play', fn);
    emitter.off('play', fn);
    emitter.emit('play', undefined as never);
    expect(fn).not.toHaveBeenCalled();
  });

  it('passes data to listener', () => {
    const emitter = new PlayerEmitter();
    const fn = vi.fn();
    emitter.on('frameupdate', fn);
    emitter.emit('frameupdate', 42);
    expect(fn).toHaveBeenCalledWith(42);
  });

  it('removeAllListeners clears everything', () => {
    const emitter = new PlayerEmitter();
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    emitter.on('play', fn1);
    emitter.on('pause', fn2);
    emitter.removeAllListeners();
    emitter.emit('play', undefined as never);
    emitter.emit('pause', undefined as never);
    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).not.toHaveBeenCalled();
  });
});
