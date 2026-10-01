# Glow Grove

A cozy, local-only game about catching five fireflies in a moonlit meadow. The
round uses a fixed target sequence with no countdown, randomness, backend, or
external assets.

## Run locally

Vite 8 requires Node.js `^20.19.0` or `>=22.12.0`.

```sh
npm install
npm run dev
```

For the browser checks, install Chromium once:

```sh
npx playwright install chromium
```

## Verify

```sh
npm run typecheck
npm test
npm run build
npm run lint
```

The Playwright smoke tests start their own local Vite server on port `4173`.
The development server launched by `npm run dev` uses Vite's reported local
URL; it can stay open while styles are edited to demonstrate HMR preserving an
active round.

Use Tab to focus controls and Enter or Space to activate them. The firefly
targets are real buttons, and score changes are announced politely.
