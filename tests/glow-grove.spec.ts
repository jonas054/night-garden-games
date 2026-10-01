import { expect, test, type Page } from '@playwright/test'

const catchButton = (page: Page) =>
  page.getByRole('button', { name: /^Catch the .+ firefly$/ })

test('catches all five fireflies and resets for another round', async ({
  page,
}) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', { name: 'Glow Grove', exact: true }),
  ).toBeVisible()

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
})

test('supports starting, catching, and replaying with the keyboard', async ({
  page,
}) => {
  await page.goto('/')

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
})

test('fits a narrow viewport and supports touch input', async ({ browser }) => {
  const context = await browser.newContext({
    baseURL: 'http://127.0.0.1:4173',
    hasTouch: true,
    viewport: { width: 390, height: 844 },
  })

  try {
    const page = await context.newPage()
    await page.goto('/')

    const widths = await page.evaluate(() => ({
      viewport: window.innerWidth,
      document: document.documentElement.scrollWidth,
    }))
    expect(widths.document).toBeLessThanOrEqual(widths.viewport)

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
