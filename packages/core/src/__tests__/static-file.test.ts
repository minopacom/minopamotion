import { describe, it, expect } from 'vitest';
import { staticFile } from '../utils/static-file.js';

describe('staticFile', () => {
  it('prepends / for bare paths', () => {
    expect(staticFile('image.png')).toBe('/image.png');
  });

  it('preserves existing leading /', () => {
    expect(staticFile('/image.png')).toBe('/image.png');
  });

  it('handles nested paths', () => {
    expect(staticFile('assets/images/logo.png')).toBe('/assets/images/logo.png');
  });
});
