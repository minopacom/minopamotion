import { describe, it, expect, beforeEach } from 'vitest';
import { delayRender, continueRender, cancelRender } from '../delay-render/delay-render.js';

describe('delayRender', () => {
  it('returns a numeric handle', () => {
    const handle = delayRender('test');
    expect(typeof handle).toBe('number');
    continueRender(handle);
  });

  it('continueRender removes the handle', () => {
    const handle = delayRender('test');
    // Should not throw
    continueRender(handle);
  });

  it('continueRender throws for unknown handle', () => {
    expect(() => continueRender(999999)).toThrow('does not exist');
  });

  it('multiple handles work independently', () => {
    const h1 = delayRender('first');
    const h2 = delayRender('second');
    // Continue first, second still exists
    continueRender(h1);
    // Continue second
    continueRender(h2);
    // Both are gone, trying again should throw
    expect(() => continueRender(h1)).toThrow('does not exist');
    expect(() => continueRender(h2)).toThrow('does not exist');
  });

  it('cancelRender does not throw in node env', () => {
    // In node environment (no window), cancelRender should not throw
    expect(() => cancelRender('some error')).not.toThrow();
    expect(() => cancelRender(new Error('some error'))).not.toThrow();
  });
});
