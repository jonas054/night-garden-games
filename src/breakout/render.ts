import {
  BREAKOUT_HEIGHT,
  BREAKOUT_WIDTH,
  PADDLE_HEIGHT,
  PADDLE_TOP,
  PADDLE_WIDTH,
  type BreakoutModel,
} from './engine'

const BRICK_COLORS = ['#f5d58b', '#d9e49e', '#b5edce', '#8ccdb0', '#79b5a0']
const STARS = [
  [52, 42, 1.2],
  [164, 231, 1],
  [271, 35, 1.3],
  [389, 244, 0.9],
  [528, 44, 1.1],
  [671, 211, 1.2],
  [728, 327, 0.8],
  [94, 311, 0.9],
  [581, 284, 0.8],
] as const

function fillRoundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  const corner = Math.min(radius, width / 2, height / 2)

  context.beginPath()
  context.moveTo(x + corner, y)
  context.arcTo(x + width, y, x + width, y + height, corner)
  context.arcTo(x + width, y + height, x, y + height, corner)
  context.arcTo(x, y + height, x, y, corner)
  context.arcTo(x, y, x + width, y, corner)
  context.closePath()
  context.fill()
}

export function drawBreakoutScene(
  canvas: HTMLCanvasElement,
  model: BreakoutModel,
): void {
  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('The Breakout playfield requires a 2D canvas context.')
  }

  const pixelRatio = Math.max(1, window.devicePixelRatio || 1)
  const pixelWidth = Math.round(BREAKOUT_WIDTH * pixelRatio)
  const pixelHeight = Math.round(BREAKOUT_HEIGHT * pixelRatio)

  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth
    canvas.height = pixelHeight
  }

  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  context.clearRect(0, 0, BREAKOUT_WIDTH, BREAKOUT_HEIGHT)

  const sky = context.createLinearGradient(0, 0, 0, BREAKOUT_HEIGHT)
  sky.addColorStop(0, '#112d30')
  sky.addColorStop(0.6, '#102827')
  sky.addColorStop(1, '#0b211f')
  context.fillStyle = sky
  context.fillRect(0, 0, BREAKOUT_WIDTH, BREAKOUT_HEIGHT)

  const horizonGlow = context.createRadialGradient(
    BREAKOUT_WIDTH / 2,
    BREAKOUT_HEIGHT * 0.8,
    12,
    BREAKOUT_WIDTH / 2,
    BREAKOUT_HEIGHT * 0.8,
    BREAKOUT_WIDTH * 0.56,
  )
  horizonGlow.addColorStop(0, 'rgba(102, 166, 127, 0.16)')
  horizonGlow.addColorStop(1, 'rgba(102, 166, 127, 0)')
  context.fillStyle = horizonGlow
  context.fillRect(0, 0, BREAKOUT_WIDTH, BREAKOUT_HEIGHT)

  for (const [x, y, radius] of STARS) {
    context.beginPath()
    context.fillStyle = 'rgba(238, 239, 211, 0.65)'
    context.arc(x, y, radius, 0, Math.PI * 2)
    context.fill()
  }

  for (const brick of model.bricks) {
    if (!brick.active) {
      continue
    }

    const color = BRICK_COLORS[brick.row]
    context.shadowColor = color
    context.shadowBlur = 8
    context.fillStyle = color
    fillRoundedRect(
      context,
      brick.x,
      brick.y,
      brick.width,
      brick.height,
      5,
    )
    context.shadowBlur = 0
    context.fillStyle = 'rgba(255, 255, 255, 0.34)'
    fillRoundedRect(
      context,
      brick.x + 5,
      brick.y + 4,
      brick.width - 10,
      2,
      1,
    )
  }

  const paddleLeft = model.paddleX - PADDLE_WIDTH / 2
  context.shadowColor = 'rgba(245, 213, 139, 0.7)'
  context.shadowBlur = 18
  context.fillStyle = '#f5d58b'
  fillRoundedRect(
    context,
    paddleLeft,
    PADDLE_TOP,
    PADDLE_WIDTH,
    PADDLE_HEIGHT,
    PADDLE_HEIGHT / 2,
  )
  context.shadowBlur = 0
  context.fillStyle = 'rgba(255, 248, 220, 0.74)'
  fillRoundedRect(
    context,
    paddleLeft + 12,
    PADDLE_TOP + 3,
    PADDLE_WIDTH - 24,
    2,
    1,
  )

  const ballGlow = context.createRadialGradient(
    model.ball.x - 2,
    model.ball.y - 2,
    1,
    model.ball.x,
    model.ball.y,
    model.ball.radius,
  )
  ballGlow.addColorStop(0, '#fff9df')
  ballGlow.addColorStop(0.55, '#f5d58b')
  ballGlow.addColorStop(1, '#dfa94c')
  context.shadowColor = 'rgba(245, 213, 139, 0.9)'
  context.shadowBlur = 22
  context.beginPath()
  context.fillStyle = ballGlow
  context.arc(model.ball.x, model.ball.y, model.ball.radius, 0, Math.PI * 2)
  context.fill()
  context.shadowBlur = 0

  context.fillStyle = 'rgba(198, 225, 197, 0.18)'
  context.fillRect(24, BREAKOUT_HEIGHT - 2, BREAKOUT_WIDTH - 48, 1)
}
