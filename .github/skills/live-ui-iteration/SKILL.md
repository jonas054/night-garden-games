---
name: live-ui-iteration
description: Runs a local-browser feedback loop for web UI changes using the repository's dev server and Playwright CLI. Use when changing or debugging visible UI, layout, responsive behavior, or browser interactions in this repository.
allowed-tools: Bash(playwright-cli:*) Bash(npm:*) Bash(node:*) Bash(npx --no-install playwright:*)
---

# Live UI Iteration

Use the running application as feedback while making UI changes. Keep implementation and browser verification in the same task context so the loop can respond directly to user feedback.

## Start the preview

1. Read the repository instructions and inspect its README, manifests, and scripts to identify the actual start command, package manager, route, and local URL. Never assume a framework, command, or port.
2. Reuse a running preview only when it is clearly for this repository. Otherwise, start the documented command in a managed terminal process that keeps logs available. Wait for its ready message and use the URL it reports. Do not detach a process or kill an unknown process to free a port.
3. If the CLI cannot keep the server running, or the app needs a missing command, configuration, or service, stop and ask the user to start or configure it. Give the exact command or missing value and wait.
4. Resolve an existing Playwright CLI before asking to install anything:
   - First check `playwright-cli --help`.
   - If the command is missing, check the active npm global install with `npm ls -g --depth=0 @playwright/cli`. When present, run `node "$(npm root -g)/@playwright/cli/playwright-cli.js" --help` and use `node "$(npm root -g)/@playwright/cli/playwright-cli.js"` as the command prefix for browser commands. This works even when the global npm bin directory is missing from `PATH`.
   - The package that provides the `playwright-cli` executable is `@playwright/cli`. The unscoped `playwright-cli` package is deprecated and does not provide the CLI binary. A persistent global install is `npm install -g @playwright/cli@latest`; install it only with the user's approval. Global installs belong to the active Node/npm prefix, so compare `command -v node`, `npm prefix -g`, and `npm root -g` across sessions if an install appears to disappear. Project-local installs and `npx` runs do not make the command globally available.
   - If the global package is absent, check for a local Playwright installation with `npx --no-install playwright --version`; when present, use `npx --no-install playwright cli` for browser commands.
   - Do not install packages or download browsers without the user's approval.
5. Open an isolated, named, headed browser session against the discovered local URL and keep it open during edits:

   ```bash
   playwright-cli -s=live-ui open <actual-local-url> --headed
   ```

   Use the CLI prefix resolved in step 4 for this and all later browser commands. For a global package outside `PATH`, use `node "$(npm root -g)/@playwright/cli/playwright-cli.js"` as the prefix; for the local Playwright fallback, replace `playwright-cli` with `npx --no-install playwright cli`. Reuse the session for browser actions, for example `playwright-cli -s=live-ui snapshot`, `playwright-cli -s=live-ui screenshot`, and `playwright-cli -s=live-ui console`. Use `playwright-cli show` to open the live dashboard. Use `playwright-cli show --annotate` when user input on the page's design or behavior would resolve ambiguity; then wait for their annotation.

## Iterate and verify

1. Inspect the initial page and relevant route with a fresh `snapshot`; take a screenshot when visual layout matters. Record the current state before changing it.
2. Make a coherent UI change, allow HMR to update the page, then inspect a fresh snapshot. Reload only if HMR did not apply or the page is stale.
3. Exercise the changed interaction in the browser, inspect relevant console errors, and fix issues before moving on. Use current snapshot references after navigation or reload.
4. Check desktop and narrow viewport behavior when the change affects responsive layout. Run the repository's relevant tests or checks as well; browser inspection does not replace them.
5. Report only what was actually verified. Leave a preview server and browser session started for this task available to the user, give its URL, and explain how to stop it. Never close or terminate resources that were already running.

## Stop and ask the user

Stop the preview workflow and ask one focused question when:

- The app's start command or URL cannot be determined, the server fails to start, or a required service/configuration is unavailable.
- Playwright or a browser is missing and installation is needed. Request approval rather than changing global or project dependencies silently.
- The app requires authentication. Open the headed local browser if possible and ask the user to sign in there; never ask them to paste credentials or tokens.
- Continuing would access a production service, use real user data, or perform an irreversible external action. Ask before proceeding.
- Visual intent is subjective or underspecified. Use the annotation dashboard when useful, and wait for the user's direction instead of guessing.

Do not claim the page was visually verified if the browser could not be opened or inspected. If a blocker prevents browser verification but independent code work can safely continue, explain the limitation and ask whether to proceed without the live preview.
Keep generated screenshots, traces, and videos out of commits unless requested; never remove pre-existing artifacts.
