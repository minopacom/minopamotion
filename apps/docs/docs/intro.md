---
sidebar_position: 1
slug: /intro
---

# Introduction

Minopamotion is a library for creating videos programmatically using React.

## Why Minopamotion?

Traditional video editing tools are powerful but hard to automate. Minopamotion takes a different approach: **a video is a pure function of the current frame number**. You write React components that receive the current frame and render accordingly.

This means you can:

- **Use React** — the component model you already know
- **Write code** — variables, loops, conditionals, and all of JavaScript
- **Stay deterministic** — same frame always produces the same output
- **Test your videos** — because they're just React components
- **Automate at scale** — generate thousands of personalized videos from data

## How It Works

Every Minopamotion video is a React component. The component receives the current frame number and renders accordingly:

```tsx
import { useCurrentFrame, useVideoConfig, interpolate } from '@minopamotion/core';

const MyVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, fps], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ opacity, fontSize: 72, textAlign: 'center' }}>
      Hello, World!
    </div>
  );
};
```

At frame 0, the text is invisible. Over the first second (30 frames at 30fps), it fades in. At frame 30+, it's fully visible.

## Packages

| Package | Description |
|---------|-------------|
| `@minopamotion/core` | Components, hooks, and animation utilities |
| `@minopamotion/player` | Embeddable React player for previewing videos |
| `@minopamotion/renderer` | Server-side rendering with Puppeteer + FFmpeg |
| `@minopamotion/webcodecs` | Client-side rendering using the WebCodecs API |
| `@minopamotion/cli` | Command-line interface for rendering |
| `@minopamotion/studio` | Visual editor for building videos |

## Next Steps

- [Installation](/docs/getting-started/installation) — set up a new project
- [Your First Video](/docs/getting-started/your-first-video) — build and preview a video
- [The Fundamentals](/docs/concepts/the-fundamentals) — understand frame-based rendering
