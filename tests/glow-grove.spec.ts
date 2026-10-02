import { expect, test, type Page } from '@playwright/test'

const catchButton = (page: Page) =>
  page.getByRole('button', { name: /^Catch the .+ firefly$/ })

async function selectEnglish(page: Page) {
  await page.getByRole('button', { name: 'English (United Kingdom)' }).click()
}

async function selectGlowGrove(page: Page) {
  await page.getByRole('button', { name: 'Play Glow Grove' }).click()
  await expect(
    page.getByRole('heading', { name: 'Glow Grove', exact: true }),
  ).toBeVisible()
}

test('opens Glow Grove from the menu, completes a round, and returns', async ({
  page,
}) => {
  await page.goto('/')
  await selectEnglish(page)

  await expect(
    page.getByRole('heading', { name: 'Choose a game' }),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Play Glow Grove' }),
  ).toBeVisible()

  await selectGlowGrove(page)
  await page.getByRole('button', { name: 'Start catching' }).click()

  for (let caught = 1; caught <= 5; caught += 1) {
    await catchButton(page).click()
    await expect(
      page.getByText(`${caught} / 5 caught`, { exact: true }),
    ).toBeVisible()
  }

  await expect(
    page.getByRole('heading', { name: 'The grove is glowing' }),
  ).toBeVisible()
  await expect(page.getByRole('status')).toHaveText(
    'You caught all five fireflies. The grove is glowing.',
  )

  await page.getByRole('button', { name: 'Play again' }).click()
  await expect(
    page.getByRole('button', { name: 'Start catching' }),
  ).toBeVisible()
  await expect(page.getByText('0 / 5 caught', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: 'All games' }).click()
  await expect(
    page.getByRole('heading', { name: 'Choose a game' }),
  ).toBeVisible()
})

test('supports menu selection, catching, and replay with the keyboard', async ({
  page,
}) => {
  await page.goto('/')
  await selectEnglish(page)

  const selectButton = page.getByRole('button', { name: 'Play Glow Grove' })
  await selectButton.focus()
  await page.keyboard.press('Enter')

  const startButton = page.getByRole('button', { name: 'Start catching' })
  await startButton.focus()
  await page.keyboard.press('Enter')

  for (let caught = 1; caught <= 5; caught += 1) {
    const target = catchButton(page)
    await target.focus()
    await page.keyboard.press('Space')
    await expect(
      page.getByText(`${caught} / 5 caught`, { exact: true }),
    ).toBeVisible()
  }

  const replayButton = page.getByRole('button', { name: 'Play again' })
  await replayButton.focus()
  await page.keyboard.press('Enter')

  await expect(startButton).toBeVisible()
  await expect(page.getByText('0 / 5 caught', { exact: true })).toBeVisible()

  const backButton = page.getByRole('button', { name: 'All games' })
  await backButton.focus()
  await page.keyboard.press('Enter')
  await expect(
    page.getByRole('heading', { name: 'Choose a game' }),
  ).toBeVisible()
})

test('fits a narrow menu and game and supports touch input', async ({
  browser,
}) => {
  const context = await browser.newContext({
    baseURL: 'http://127.0.0.1:4173',
    hasTouch: true,
    viewport: { width: 390, height: 844 },
  })

  try {
    const page = await context.newPage()
    await page.goto('/')
    await selectEnglish(page)

    const widths = await page.evaluate(() => ({
      viewport: window.innerWidth,
      document: document.documentElement.scrollWidth,
    }))
    expect(widths.document).toBeLessThanOrEqual(widths.viewport)

    await page.getByRole('button', { name: 'Play Glow Grove' }).tap()
    const gameWidths = await page.evaluate(() => ({
      viewport: window.innerWidth,
      document: document.documentElement.scrollWidth,
    }))
    expect(gameWidths.document).toBeLessThanOrEqual(gameWidths.viewport)

    await page.getByRole('button', { name: 'Start catching' }).tap()

    for (let caught = 1; caught <= 5; caught += 1) {
      await catchButton(page).tap()
      await expect(
        page.getByText(`${caught} / 5 caught`, { exact: true }),
      ).toBeVisible()
    }

    await expect(
      page.getByRole('heading', { name: 'The grove is glowing' }),
    ).toBeVisible()
  } finally {
    await context.close()
  }
})
