# Night Garden

A small, local-only collection of cozy games. Choose between **Glow Grove**, a
firefly-catching game in a moonlit meadow, and **Moonlit Breakout**, a paddle
game with five rows of glowing bricks.

The interface is Swedish by default. Use the 🇸🇪, 🇬🇧, and 🇨🇳 flag buttons to
switch to Swedish, British English, or Simplified Chinese.

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
`src/gameTypes.ts`, then add its title, menu details, artwork variant, and
component to `GAME_CATALOG` in `src/gameCatalog.ts`. Add a matching artwork
preview in `src/App.tsx` when introducing a new variant. The menu is rendered
from that catalog. Each game should provide a button that returns to the menu.

Use Tab to focus controls and Enter or Space to activate them. Glow Grove's
firefly targets are real buttons, and score changes are announced politely.
In Moonlit Breakout, focus the playfield and use the arrow keys or A / D to
steer the paddle. Pointer and touch steering are supported; Space or P pauses.
