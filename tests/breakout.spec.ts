import { expect, test, type Page } from '@playwright/test'
import {
  BALL_RADIUS,
  BREAKOUT_HEIGHT,
  BREAKOUT_WIDTH,
  BRICK_ROWS,
  BRICK_COLUMNS,
  PADDLE_TOP,
  PADDLE_WIDTH,
  STARTING_LIVES,
  createBreakoutModel,
  getBricksRemaining,
  movePaddleTo,
  stepBreakout,
} from '../src/breakout/engine.ts'

async function selectBreakout(page: Page) {
  await page.getByRole('button', { name: 'English (United Kingdom)' }).click()
  await page.getByRole('button', { name: 'Play Moonlit Breakout' }).click()
  await expect(
    page.getByRole('heading', { name: 'Moonlit Breakout', exact: true }),
  ).toBeVisible()
}

test('creates a full brick field and keeps the paddle inside the playfield', () => {
  const model = createBreakoutModel()

  expect(model.bricks).toHaveLength(BRICK_ROWS * BRICK_COLUMNS)
  expect(getBricksRemaining(model)).toBe(BRICK_ROWS * BRICK_COLUMNS)
  expect(model.lives).toBe(STARTING_LIVES)
  expect(model.score).toBe(0)

  movePaddleTo(model, -100)
  expect(model.paddleX).toBe(PADDLE_WIDTH / 2)

  movePaddleTo(model, 1000)
  expect(model.paddleX).toBe(BREAKOUT_WIDTH - PADDLE_WIDTH / 2)
})

test('scores a brick hit and reports a win when it was the last brick', () => {
  const model = createBreakoutModel()
  const brick = model.bricks[0]!
  for (const remainingBrick of model.bricks.slice(1)) {
    remainingBrick.active = false
  }

  model.ball.x = brick.x + brick.width / 2
  model.ball.y = brick.y + brick.height + BALL_RADIUS + 1
  model.ball.vx = 0
  model.ball.vy = -120

  expect(stepBreakout(model, 0.02, 0)).toBe('won')
  expect(brick.active).toBe(false)
  expect(model.score).toBe(10)
  expect(getBricksRemaining(model)).toBe(0)
})

test('resets the ball after a miss and ends the game when lives run out', () => {
  const model = createBreakoutModel()

  const dropBall = () => {
    model.ball.x = 100
    model.ball.y = BREAKOUT_HEIGHT + BALL_RADIUS + 1
    model.ball.vx = 0
    model.ball.vy = 100
    return stepBreakout(model, 0.001, 0)
  }

  expect(dropBall()).toBe('playing')
  expect(model.lives).toBe(STARTING_LIVES - 1)
  expect(model.ball.y).toBe(PADDLE_TOP - BALL_RADIUS - 3)
  expect(dropBall()).toBe('playing')
  expect(dropBall()).toBe('lost')
  expect(model.lives).toBe(0)
})

test('starts, pauses, resumes, and returns to the menu', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'English (United Kingdom)' }).click()
  await expect(
    page.getByRole('heading', { name: 'Choose a game' }),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Play Moonlit Breakout' }),
  ).toBeVisible()

  await selectBreakout(page)
  const canvas = page.locator('canvas.breakout-board')
  await expect(canvas).toBeVisible()
  await page.getByRole('button', { name: 'Start breakout' }).click()
  await expect(page.getByRole('button', { name: 'Pause game' })).toBeVisible()
  await expect(canvas).toBeFocused()

  await page.keyboard.press('p')
  await expect(
    page.getByRole('heading', { name: 'Game paused' }),
  ).toBeVisible()
  await expect(page.getByRole('status')).toHaveText('Breakout paused.')

  await page.keyboard.press('p')
  await expect(page.getByRole('button', { name: 'Pause game' })).toBeVisible()
  await expect(canvas).toBeFocused()

  await page.getByRole('button', { name: 'Pause game' }).click()
  await page.getByRole('button', { name: 'Resume game' }).click()
  await expect(page.getByRole('button', { name: 'Pause game' })).toBeVisible()
  await page.getByRole('button', { name: 'All games' }).click()

  await expect(
    page.getByRole('heading', { name: 'Choose a game' }),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Play Glow Grove' }),
  ).toBeVisible()
})

test('fits and accepts touch steering on a narrow screen', async ({ browser }) => {
  const context = await browser.newContext({
    baseURL: 'http://127.0.0.1:4173',
    hasTouch: true,
    viewport: { width: 390, height: 844 },
  })

  try {
    const page = await context.newPage()
    await page.goto('/')
    await page.getByRole('button', { name: 'English (United Kingdom)' }).click()
    await page.getByRole('button', { name: 'Play Moonlit Breakout' }).tap()

    const canvas = page.locator('canvas.breakout-board')
    await expect(canvas).toBeVisible()
    await page.getByRole('button', { name: 'Start breakout' }).tap()

    const dimensions = await page.evaluate(() => ({
      viewport: window.innerWidth,
      document: document.documentElement.scrollWidth,
    }))
    const boardBounds = await canvas.boundingBox()

    expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport)
    expect(boardBounds).not.toBeNull()
    expect(boardBounds!.width).toBeLessThanOrEqual(dimensions.viewport)

    await canvas.tap({ position: { x: 60, y: 120 } })
    await expect(page.getByRole('button', { name: 'Pause game' })).toBeVisible()
  } finally {
    await context.close()
  }
})
