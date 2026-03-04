# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
pnpm build                              # Build all packages (Turbo, respects dependency order)
pnpm test                               # Run all tests (depends on build)
pnpm dev                                # Watch mode (tsup --watch for packages)
pnpm clean                              # Remove all dist/ directories

pnpm --filter @minopamotion/core build  # Build single package
pnpm --filter @minopamotion/core test   # Test single package
pnpm --filter @minopamotion/player test # Test single package

cd apps/example && pnpm dev             # Run example app (Vite dev server)
```

Turbo pipeline: `build` depends on `^build` (dependencies build first), `test` depends on `build`.

## Architecture

**Monorepo** with pnpm workspaces + Turbo. Packages use tsup (ESM + CJS + DTS output).

### @minopamotion/core

Pure React library with zero Node.js APIs. Peer deps: react, react-dom.

**Core principle:** A video is a pure function of frame number. React components receive the current frame via context and render deterministically.

**Context chain** (the foundation of everything):
- `TimelineContext` — holds `{ frame, playing, playbackRate }`, set externally by player/renderer
- `SequenceContext` — cumulative frame offsets for nested Sequences
- `useCurrentFrame()` = `timeline.frame - sequence.cumulatedFrom - sequence.relativeFrom`

**Sequence nesting math:** Inner `<Sequence from={60}>` inside outer `<Sequence from={30}>` → children see frame 0 at absolute frame 90. Offsets are cumulative.

**Dual export paths:**
- `@minopamotion/core` — public API (components, hooks, animation utils)
- `@minopamotion/core/internals` — contexts and providers consumed by player/renderer. Not public API, may change between versions.

### @minopamotion/player

Embeddable React player component. Depends on `@minopamotion/core`.

**Each Player instance is fully isolated** — gets its own `TimelineContext`, `VideoConfigContext`, `MediaVolumeContext`, `DelayRenderContext` via `SharedPlayerContext`. Multiple Players on one page don't share state.

**Playback loop:** `requestAnimationFrame` with `setTimeout` fallback when tab is backgrounded. Frame calculation is a pure function (`calculateNextFrame`).

**PlayerRef** (imperative API via `forwardRef`): `play()`, `pause()`, `toggle()`, `seekTo(frame)`, `getCurrentFrame()`, `isPlaying()`, volume/mute/playbackRate controls, typed `addEventListener()`.

### Dependency flow

```
apps/example → @minopamotion/player → @minopamotion/core
                                       ↑ uses /internals export
```

## Key Conventions

- All imports use `.js` extensions (ESM requirement): `import { foo } from './bar.js'`
- Package exports: `types` condition must come BEFORE `import`/`require` in package.json exports
- Window access in strict TS requires `window as unknown as Record<string, unknown>`
- Tests live in `src/__tests__/*.test.ts`, use vitest with `environment: 'node'`
- React 18 and 19 are both supported via peer dependency range
- `Composition` component renders nothing (returns null) — it registers via `useEffect` side effect
- Packages use `workspace:*` protocol for local dependencies
