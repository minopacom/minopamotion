import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'vite', '@minopamotion/core', '@minopamotion/player', '@minopamotion/webcodecs', 'webm-muxer', 'html2canvas'],
});
