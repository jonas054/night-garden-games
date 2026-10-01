# Night Garden

A small, local-only collection of cozy games. The home menu currently features
Glow Grove, a deterministic game about catching five fireflies in a moonlit
meadow.

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

## Add a game

Create a game component that accepts `GameComponentProps` from
`src/gameTypes.ts`, then add its title, menu details, and component to
`GAME_CATALOG` in `src/gameCatalog.ts`. The menu is rendered from that catalog.
Each game should provide a button that returns to the menu.

Use Tab to focus controls and Enter or Space to activate them. Glow Grove's
firefly targets are real buttons, and score changes are announced politely.
