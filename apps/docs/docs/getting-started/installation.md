---
sidebar_position: 1
---

# Installation

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- [pnpm](https://pnpm.io/) (recommended) or npm/yarn

## Install Packages

Install the core library and the player:

```bash
pnpm add @minopamotion/core @minopamotion/player react react-dom
```

Or with npm:

```bash
npm install @minopamotion/core @minopamotion/player react react-dom
```

## Peer Dependencies

`@minopamotion/core` and `@minopamotion/player` require React 18 or 19 as peer dependencies. If your project already has React installed, you only need to install the Minopamotion packages.

## TypeScript

Minopamotion is written in TypeScript and ships type definitions. No additional `@types` packages are needed.

## What's Next

Now that you have Minopamotion installed, [create your first video](/docs/getting-started/your-first-video).
