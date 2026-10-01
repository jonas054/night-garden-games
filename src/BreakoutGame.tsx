import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'
import {
  BREAKOUT_HEIGHT,
  BREAKOUT_WIDTH,
  BRICK_COLUMNS,
  BRICK_ROWS,
  STARTING_LIVES,
  createBreakoutModel,
  getBricksRemaining,
  movePaddleTo,
  stepBreakout,
  type BreakoutModel,
  type BreakoutResult,
  type PaddleDirection,
} from './breakout/engine'
import { drawBreakoutScene } from './breakout/render'
import type { GameComponentProps } from './gameTypes'
import './App.css'
import './BreakoutGame.css'

type BreakoutPhase = BreakoutResult | 'ready' | 'paused'

interface BreakoutHud {
  score: number
  bricks: number
  lives: number
}

function getHud(model: BreakoutModel): BreakoutHud {
  return {
    score: model.score,
    bricks: getBricksRemaining(model),
    lives: model.lives,
  }
}

function BreakoutGame({ onBackToMenu }: GameComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const modelRef = useRef(createBreakoutModel())
  const keysRef = useRef({ left: false, right: false })
  const [phase, setPhase] = useState<BreakoutPhase>('ready')
  const [hud, setHud] = useState<BreakoutHud>({
    score: 0,
    bricks: BRICK_ROWS * BRICK_COLUMNS,
    lives: STARTING_LIVES,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const model = modelRef.current
    drawBreakoutScene(canvas, model)
    if (phase !== 'playing') {
      return
    }

    let animationFrame = 0
    let previousTime = 0
    let previousScore = model.score
    let previousLives = model.lives

    const animate = (timestamp: number) => {
      const elapsed = previousTime === 0 ? 0 : (timestamp - previousTime) / 1000
      previousTime = timestamp
      const keys = keysRef.current
      const direction: PaddleDirection =
        keys.left === keys.right ? 0 : keys.left ? -1 : 1
      const result = stepBreakout(model, elapsed, direction)

      drawBreakoutScene(canvas, model)

      if (model.score !== previousScore || model.lives !== previousLives) {
        previousScore = model.score
        previousLives = model.lives
        setHud(getHud(model))
      }

      if (result !== 'playing') {
        setHud(getHud(model))
        setPhase(result)
        return
      }

      animationFrame = window.requestAnimationFrame(animate)
    }

    animationFrame = window.requestAnimationFrame(animate)
    return () => window.cancelAnimationFrame(animationFrame)
  }, [phase])

  function startRound() {
    keysRef.current.left = false
    keysRef.current.right = false
    setPhase('playing')
    canvasRef.current?.focus()
  }

  function resetRound() {
    const model = createBreakoutModel()
    modelRef.current = model
    keysRef.current.left = false
    keysRef.current.right = false
    setHud(getHud(model))
    setPhase('ready')
  }

  function resumeRound() {
    setPhase('playing')
    canvasRef.current?.focus()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLCanvasElement>) {
    const key = event.key.toLowerCase()

    if (event.key === 'ArrowLeft' || key === 'a') {
      keysRef.current.left = true
      event.preventDefault()
      return
    }

    if (event.key === 'ArrowRight' || key === 'd') {
      keysRef.current.right = true
      event.preventDefault()
      return
    }

    if (event.code === 'Space') {
      event.preventDefault()
      if (event.repeat) {
        return
      }
      if (phase === 'ready') {
        startRound()
      } else if (phase === 'playing') {
        setPhase('paused')
      } else if (phase === 'paused') {
        resumeRound()
      }
      return
    }

    if (key === 'p' && !event.repeat) {
      if (phase === 'playing') {
        setPhase('paused')
      } else if (phase === 'paused') {
        resumeRound()
      }
    }
  }

  function handleKeyUp(event: KeyboardEvent<HTMLCanvasElement>) {
    const key = event.key.toLowerCase()
    if (event.key === 'ArrowLeft' || key === 'a') {
      keysRef.current.left = false
    } else if (event.key === 'ArrowRight' || key === 'd') {
      keysRef.current.right = false
    }
  }

  function handlePointerMove(event: PointerEvent<HTMLCanvasElement>) {
    const bounds = event.currentTarget.getBoundingClientRect()
    if (bounds.width === 0) {
      return
    }

    const x = ((event.clientX - bounds.left) / bounds.width) * BREAKOUT_WIDTH
    const model = modelRef.current
    movePaddleTo(model, x)

    if (phase !== 'playing') {
      drawBreakoutScene(event.currentTarget, model)
    }
  }

  function handlePointerDown(event: PointerEvent<HTMLCanvasElement>) {
    event.currentTarget.focus()
    handlePointerMove(event)
  }

  function clearKeys() {
    keysRef.current.left = false
    keysRef.current.right = false
  }

  const statusMessage =
    phase === 'won'
      ? `You cleared every brick with a score of ${hud.score}.`
      : phase === 'lost'
        ? `Game over. Final score: ${hud.score}.`
        : phase === 'paused'
          ? 'Breakout paused.'
          : phase === 'playing'
            ? `Score ${hud.score}. ${hud.bricks} bricks remain. ${hud.lives} lives left.`
            : ''

  return (
    <div className="app-shell">
      <header className="topline">
        <div className="wordmark">
          <span className="wordmark__spark" aria-hidden="true" />
          <span className="wordmark__name">Moonlit Breakout</span>
        </div>
        <button
          aria-label="Back to game menu"
          className="topline__back"
          onClick={onBackToMenu}
          type="button"
        >
          <span className="topline__back-arrow" aria-hidden="true">
            ←
          </span>
          All games
        </button>
      </header>

      <main className="game-page" aria-labelledby="breakout-title">
        <header className="intro breakout-intro">
          <p className="intro__eyebrow">
            <span className="intro__asterisk" aria-hidden="true" />
            A tiny moonlit arcade
          </p>
          <h1 id="breakout-title">
            Moonlit <span>Breakout</span>
          </h1>
          <p className="intro__copy">
            Keep the glow moving and clear the night sky.
          </p>
        </header>

        <div className="breakout-layout">
          <aside className="breakout-score-card" aria-label="Breakout score">
            <div className="score-card__top">
              <p className="score-card__kicker">Tonight&apos;s arcade</p>
              <span className="score-card__moon" aria-hidden="true" />
            </div>
            <div className="breakout-score">
              <p>Score</p>
              <strong>{hud.score}</strong>
              <span>points</span>
            </div>
            <div className="breakout-metrics">
              <div>
                <span>Bricks left</span>
                <strong>{hud.bricks}</strong>
              </div>
              <div>
                <span>Lives</span>
                <strong>{hud.lives}</strong>
              </div>
            </div>
            {phase === 'playing' && (
              <button
                className="breakout-pause"
                onClick={() => setPhase('paused')}
                type="button"
              >
                Pause game
              </button>
            )}
          </aside>

          <div className="breakout-main">
            <section className="breakout-stage" aria-label="Breakout playfield">
              <canvas
                aria-describedby="breakout-instructions"
                aria-label="Breakout playfield. Focus here, then use the left and right arrow keys or A and D to move the paddle. Pointer and touch steering are also supported."
                className="breakout-board"
                height={BREAKOUT_HEIGHT}
                onBlur={clearKeys}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                ref={canvasRef}
                role="application"
                tabIndex={0}
                width={BREAKOUT_WIDTH}
              >
                Breakout playfield
              </canvas>

              {phase !== 'playing' && (
                <div className="breakout-overlay">
                  <div className="state-card breakout-state-card">
                    {phase === 'ready' && (
                      <>
                        <p className="state-card__eyebrow">Ready for a bounce?</p>
                        <h2>Clear the night sky</h2>
                        <p>
                          Break every glowing brick and keep the ball in play.
                        </p>
                        <button
                          className="primary-action"
                          onClick={startRound}
                          type="button"
                        >
                          Start breakout
                        </button>
                      </>
                    )}
                    {phase === 'paused' && (
                      <>
                        <p className="state-card__eyebrow">Take a moonlit pause</p>
                        <h2>Game paused</h2>
                        <p>Your score and lives are right where you left them.</p>
                        <button
                          className="primary-action"
                          onClick={resumeRound}
                          type="button"
                        >
                          Resume game
                        </button>
                      </>
                    )}
                    {phase === 'won' && (
                      <>
                        <p className="state-card__eyebrow">All clear</p>
                        <h2>The sky is yours</h2>
                        <p>You swept every brick from the moonlit sky.</p>
                        <button
                          className="primary-action"
                          onClick={resetRound}
                          type="button"
                        >
                          Play again
                        </button>
                      </>
                    )}
                    {phase === 'lost' && (
                      <>
                        <p className="state-card__eyebrow">The night goes on</p>
                        <h2>Out of lives</h2>
                        <p>Take a breath and give the bricks another try.</p>
                        <button
                          className="primary-action"
                          onClick={resetRound}
                          type="button"
                        >
                          Try again
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </section>

            <p className="breakout-instructions" id="breakout-instructions">
              Focus the playfield: use ← → or A / D to move. Space or P pauses.
              Pointer and touch move the paddle.
            </p>
          </div>
        </div>

        <p className="visually-hidden" role="status" aria-live="polite" aria-atomic="true">
          {statusMessage}
        </p>
      </main>

      <footer className="game-footer">
        <p className="game-footer__note">One ball. Five rows. Three lives.</p>
        <p className="game-footer__keys">
          <kbd>←</kbd>
          <kbd>→</kbd>
          <span>move</span>
          <span aria-hidden="true">·</span>
          <kbd>Space</kbd>
          <span>pause</span>
        </p>
      </footer>
    </div>
  )
}

export default BreakoutGame
