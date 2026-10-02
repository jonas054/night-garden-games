import { expect, test } from '@playwright/test'

test('defaults to Swedish and can change language while a game is open', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('lang', 'sv')
  await expect(
    page.getByRole('heading', { name: 'Välj ett spel' }),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Svenska' }),
  ).toHaveAttribute('aria-pressed', 'true')
  await expect(
    page.getByRole('button', { name: 'Spela Glow Grove' }),
  ).toBeVisible()

  await page
    .getByRole('button', { name: 'English (United Kingdom)' })
    .click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-GB')
  await expect(
    page.getByRole('heading', { name: 'Choose a game' }),
  ).toBeVisible()
  await expect(page).toHaveTitle('Night Garden – cosy games')

  await page.getByRole('button', { name: 'Play Glow Grove' }).click()
  await expect(
    page.getByRole('button', { name: 'Start catching' }),
  ).toBeVisible()

  await page.getByRole('button', { name: 'Svenska' }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'sv')
  await expect(
    page.getByRole('button', { name: 'Börja fånga' }),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Alla spel' }),
  ).toBeVisible()
})

test('shows Simplified Chinese flags and copy on a narrow screen', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('button', { name: '简体中文' }).click()

  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-Hans')
  await expect(
    page.getByRole('heading', { name: '选择一款游戏' }),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: '简体中文' }),
  ).toHaveAttribute('aria-pressed', 'true')

  const menuDimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
  }))
  expect(menuDimensions.document).toBeLessThanOrEqual(menuDimensions.viewport)

  await page
    .getByRole('button', { name: '开始游玩：Moonlit Breakout' })
    .click()
  const canvas = page.locator('canvas.breakout-board')
  await expect(canvas).toHaveAttribute('aria-label', /打砖块游戏区/)
  await page.getByRole('button', { name: '开始游戏' }).click()
  await expect(page.getByRole('button', { name: '暂停游戏' })).toBeVisible()
  await page.getByRole('button', { name: '暂停游戏' }).click()

  await expect(page.getByRole('heading', { name: '游戏已暂停' })).toBeVisible()
  await expect(page.getByRole('status')).toHaveText('打砖块游戏已暂停。')
  await page.getByRole('button', { name: '所有游戏' }).click()
  await expect(
    page.getByRole('heading', { name: '选择一款游戏' }),
  ).toBeVisible()

  await page.getByRole('button', { name: '开始游玩：Glow Grove' }).click()
  await page.getByRole('button', { name: '开始捕捉' }).click()
  await expect(
    page.getByRole('button', { name: '捕捉琥珀色的萤火虫' }),
  ).toBeVisible()
  await page.getByRole('button', { name: '捕捉琥珀色的萤火虫' }).click()
  await expect(page.getByRole('status')).toHaveText(
    '你已捕捉 1 / 5 只萤火虫。',
  )
  await expect(
    page.getByRole('button', { name: '捕捉薄荷绿的萤火虫' }),
  ).toBeVisible()
})
