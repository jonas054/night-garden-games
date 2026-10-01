# Glow Grove: Live UI Iteration Demo Plan

**Status:** Proposed

**Purpose:** Build a small web game that makes Copilot CLI's live UI iteration workflow easy to see and repeat.

## Product direction

Create **Glow Grove**, a cozy, single-page game about catching five fireflies in a moonlit meadow. Keep it visually expressive but deliberately small: the game should provide clear UI states and interactions without distracting from the coding-agent workflow being demonstrated.

### MVP behavior

The game has three states:

1. **Ready:** Show the Glow Grove title, a short instruction, and a “Start catching” button.
2. **Playing:** Show the meadow, current score/progress, and one firefly target at a time. Catching it updates the score and reveals the next target.
3. **Complete:** After five catches, show the result and a “Play again” button that resets the game.

Use a fixed target sequence and no countdown, random placement, backend, account, or external assets in the MVP. This keeps the experience repeatable for browser automation and makes failures easier to reproduce. Use CSS for decorative motion and honor `prefers-reduced-motion`.

### Visual direction

Use a dark, dusky meadow with soft gradients and luminous fireflies in warm gold and mint. Keep the main play area prominent, with a compact score panel beside it on desktop and above it on narrow screens. Make controls comfortable to tap, keep text readable, and provide visible keyboard focus.

## Step-by-step implementation

### 1. Prepare the project

1. Check the installed Node.js and package-manager versions against the current Vite requirements.
2. Scaffold a Vite React + TypeScript app in the repository root. Preserve the existing `.github/skills/live-ui-iteration/SKILL.md`; do not overwrite or move it.
3. Use the package manager selected by the scaffold and keep the app local-only. Do not add external services or credentials.
4. Keep the starter's `dev`, `build`, and `preview` scripts. Add a separate type-check command such as `tsc --noEmit`; Vite transpiles TypeScript but does not type-check it.
5. Start the documented dev script, capture the URL from its output, and verify that the local page loads. Do not assume a port.

### 2. Implement the game state

1. Define a small state model: `ready`, `playing`, or `complete`, plus the current catch count.
2. Start a round at zero and advance through five fixed target positions. After the fifth catch, show the completion state.
3. Make “Play again” reset all round state. Keep the game logic separate from styling so visual edits do not change its behavior.
4. Avoid wall-clock timing and randomness in the first version. Add them only if they improve the demo enough to justify less deterministic checks.

### 3. Build accessible, automatable UI

1. Represent the start, catch, and replay actions as real buttons with descriptive accessible names.
2. Expose score/progress as text and announce score changes politely to assistive technology.
3. Support pointer/touch and keyboard activation without relying on canvas-only controls.
4. Use semantic headings and landmarks. Prefer role- and label-based browser interaction over CSS classes or brittle DOM paths.

### 4. Style desktop and mobile layouts

1. Establish the color, spacing, and type scale with a small set of CSS custom properties.
2. Make the desktop layout center the meadow and keep the score panel visible alongside it.
3. At narrow widths, stack the score panel and game area, preserve usable target sizes, and avoid horizontal scrolling.
4. Add restrained transitions for catches and state changes. Disable or reduce them when the user prefers reduced motion.

### 5. Add repeatable browser verification

1. Use the `live-ui-iteration` skill and Playwright CLI for headed inspection, snapshots, interaction, screenshots, console checks, and the live dashboard.
2. Add one browser smoke test for the core flow: start, catch five targets, verify completion, replay, and verify reset. Use accessible roles and names so the test survives visual restyling.
3. If a test-runner dependency or browser download is required, request approval before installing it. If that is not approved, keep the browser verification in the Playwright CLI workflow.
4. Check the app at a desktop viewport and a narrow mobile viewport. Confirm the game can be completed with keyboard input and that no relevant console errors appear.
5. Run the app's type-check and production build separately from browser checks.

### 6. Rehearse the Live UI Iteration demo

1. Start the dev server and open the reported local URL in a named, headed Playwright session. Open the Playwright dashboard so the user can see the page while Copilot works.
2. Begin a round and make a CSS-only change to the title or score panel. Confirm the browser updates through HMR without a manual reload and that the current game state remains intact.
3. Ask Copilot to refine the mobile layout. Resize the browser, inspect the result, and exercise the controls at the narrow viewport.
4. Use the dashboard's annotation mode to collect a specific visual comment. Wait for the user's annotation, make the requested adjustment, and inspect the result again.
5. Complete the game through browser interactions, check the completion and replay states, inspect the console, and run the smoke test and build.
6. Leave the preview available to the user and report its URL, what was verified, and how to stop the server.

## Definition of done

- The ready, playing, and complete states work, including replay.
- The same sequence can be repeated reliably without external services or unpredictable timing.
- The page is usable by pointer, touch, and keyboard, and its layout works at desktop and narrow mobile sizes.
- A visible CSS change reaches the open browser through HMR; visual feedback can be gathered with annotations.
- Browser interaction, console inspection, type-checking, and build validation have clear, repeatable steps.
- Generated screenshots, traces, and videos are not committed unless explicitly requested.

## Out of scope for the first version

- Accounts, online leaderboards, persistence, analytics, and third-party APIs.
- Real-time physics, complex levels, audio, or a large asset pipeline.
- A separate agent or MCP server; the repository skill and Playwright CLI are sufficient for this workflow.

## References

- [Vite: Getting Started](https://vite.dev/guide/) — scaffolding, dev server, scripts, and current runtime requirements.
- [Vite: Features](https://vite.dev/guide/features.html#hot-module-replacement) — HMR, React integration, and TypeScript checking behavior.
- [Playwright CLI](https://github.com/microsoft/playwright-cli) — headed browser sessions, dashboard, and annotations.
- [Playwright: Best Practices](https://playwright.dev/docs/best-practices) — isolated tests and user-facing locators.
