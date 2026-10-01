export const BREAKOUT_WIDTH = 760
export const BREAKOUT_HEIGHT = 500
export const BRICK_ROWS = 5
export const BRICK_COLUMNS = 8
export const BRICK_WIDTH = 74
export const BRICK_HEIGHT = 18
export const BRICK_GAP = 9
export const BRICK_TOP = 70
export const BALL_RADIUS = 8
export const PADDLE_WIDTH = 108
export const PADDLE_HEIGHT = 13
export const PADDLE_TOP = 456
export const STARTING_LIVES = 3

const MAX_STEP_SECONDS = 1 / 30
const PADDLE_SPEED = 560
const BALL_SPEED_X = 170
const BALL_SPEED_Y = 320

export interface BreakoutBrick {
  id: number
  row: number
  x: number
  y: number
  width: number
  height: number
  active: boolean
}

export interface BreakoutModel {
  ball: {
    x: number
    y: number
    vx: number
    vy: number
    radius: number
  }
  paddleX: number
  bricks: BreakoutBrick[]
  score: number
  lives: number
}

export type PaddleDirection = -1 | 0 | 1
export type BreakoutResult = 'playing' | 'won' | 'lost'

export function createBreakoutModel(): BreakoutModel {
  const totalBrickWidth =
    BRICK_COLUMNS * BRICK_WIDTH + (BRICK_COLUMNS - 1) * BRICK_GAP
  const left = (BREAKOUT_WIDTH - totalBrickWidth) / 2
  const bricks = Array.from({ length: BRICK_ROWS * BRICK_COLUMNS }, (_, id) => {
    const row = Math.floor(id / BRICK_COLUMNS)
    const column = id % BRICK_COLUMNS

    return {
      id,
      row,
      x: left + column * (BRICK_WIDTH + BRICK_GAP),
      y: BRICK_TOP + row * (BRICK_HEIGHT + 10),
      width: BRICK_WIDTH,
      height: BRICK_HEIGHT,
      active: true,
    }
  })

  return {
    ball: {
      x: BREAKOUT_WIDTH / 2,
      y: PADDLE_TOP - BALL_RADIUS - 3,
      vx: BALL_SPEED_X,
      vy: -BALL_SPEED_Y,
      radius: BALL_RADIUS,
    },
    paddleX: BREAKOUT_WIDTH / 2,
    bricks,
    score: 0,
    lives: STARTING_LIVES,
  }
}

export function movePaddleTo(model: BreakoutModel, centerX: number): void {
  model.paddleX = Math.max(
    PADDLE_WIDTH / 2,
    Math.min(BREAKOUT_WIDTH - PADDLE_WIDTH / 2, centerX),
  )
}

export function getBricksRemaining(model: BreakoutModel): number {
  return model.bricks.reduce(
    (remaining, brick) => remaining + Number(brick.active),
    0,
  )
}

export function stepBreakout(
  model: BreakoutModel,
  elapsedSeconds: number,
  paddleDirection: PaddleDirection,
): BreakoutResult {
  if (elapsedSeconds <= 0) {
    return 'playing'
  }

  const delta = Math.min(elapsedSeconds, MAX_STEP_SECONDS)
  const ball = model.ball
  const previousX = ball.x
  const previousY = ball.y

  movePaddleTo(
    model,
    model.paddleX + paddleDirection * PADDLE_SPEED * delta,
  )
  ball.x += ball.vx * delta
  ball.y += ball.vy * delta

  if (ball.x - ball.radius < 0) {
    ball.x = ball.radius
    ball.vx = Math.abs(ball.vx)
  } else if (ball.x + ball.radius > BREAKOUT_WIDTH) {
    ball.x = BREAKOUT_WIDTH - ball.radius
    ball.vx = -Math.abs(ball.vx)
  }

  if (ball.y - ball.radius < 0) {
    ball.y = ball.radius
    ball.vy = Math.abs(ball.vy)
  }

  const paddleLeft = model.paddleX - PADDLE_WIDTH / 2
  const paddleRight = model.paddleX + PADDLE_WIDTH / 2
  const ballTouchesPaddle =
    ball.x + ball.radius >= paddleLeft &&
    ball.x - ball.radius <= paddleRight &&
    ball.y + ball.radius >= PADDLE_TOP &&
    ball.y - ball.radius <= PADDLE_TOP + PADDLE_HEIGHT

  if (ball.vy > 0 && ballTouchesPaddle) {
    ball.y = PADDLE_TOP - ball.radius
    const offset = Math.max(
      -1,
      Math.min(1, (ball.x - model.paddleX) / (PADDLE_WIDTH / 2)),
    )
    const speed = Math.hypot(ball.vx, ball.vy)
    ball.vx = offset * speed * 0.82
    ball.vy = -Math.sqrt(speed * speed - ball.vx * ball.vx)
  }

  for (const brick of model.bricks) {
    if (!brick.active) {
      continue
    }

    const nearestX = Math.max(brick.x, Math.min(ball.x, brick.x + brick.width))
    const nearestY = Math.max(brick.y, Math.min(ball.y, brick.y + brick.height))
    const distanceX = ball.x - nearestX
    const distanceY = ball.y - nearestY

    if (
      distanceX * distanceX + distanceY * distanceY >
      ball.radius * ball.radius
    ) {
      continue
    }

    brick.active = false
    model.score += 10

    if (previousX + ball.radius <= brick.x) {
      ball.x = brick.x - ball.radius
      ball.vx = -Math.abs(ball.vx)
    } else if (previousX - ball.radius >= brick.x + brick.width) {
      ball.x = brick.x + brick.width + ball.radius
      ball.vx = Math.abs(ball.vx)
    } else if (previousY <= brick.y) {
      ball.y = brick.y - ball.radius
      ball.vy = -Math.abs(ball.vy)
    } else {
      ball.y = brick.y + brick.height + ball.radius
      ball.vy = Math.abs(ball.vy)
    }

    break
  }

  if (ball.y - ball.radius > BREAKOUT_HEIGHT) {
    model.lives -= 1
    if (model.lives === 0) {
      return 'lost'
    }

    ball.x = model.paddleX
    ball.y = PADDLE_TOP - ball.radius - 3
    ball.vx = BALL_SPEED_X
    ball.vy = -BALL_SPEED_Y
  }

  return getBricksRemaining(model) === 0 ? 'won' : 'playing'
}
