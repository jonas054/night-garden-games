import { useState } from 'react'
import {
  CATCH_TARGETS,
  catchFirefly,
  resetGame,
  startGame,
  type GameState,
} from './gameState'
import type { GameComponentProps } from './gameTypes'
import './App.css'

function GlowGroveGame({ onBackToMenu }: GameComponentProps) {
  const [game, setGame] = useState<GameState>(resetGame)
  const currentTarget =
    game.phase === 'playing' ? CATCH_TARGETS[game.caughtCount] : undefined
  const announcement =
    game.phase === 'complete'
      ? 'You caught all five fireflies. The grove is glowing.'
      : game.caughtCount > 0
        ? `You caught ${game.caughtCount} of ${CATCH_TARGETS.length} fireflies.`
        : ''

  return (
    <div className="app-shell">
      <header className="topline">
        <div className="wordmark">
          <span className="wordmark__spark" aria-hidden="true" />
          <span className="wordmark__name">Glow Grove</span>
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

      <main className="game-page" aria-labelledby="game-title">
        <header className="intro">
          <p className="intro__eyebrow">
            <span className="intro__asterisk" aria-hidden="true" />
            A tiny moonlit game
          </p>
          <h1 id="game-title">
            Glow <span>Grove</span>
          </h1>
          <p className="intro__copy">
            Follow each flicker and bring five fireflies home.
          </p>
        </header>

        <div className="game-layout">
          <aside className="score-card" aria-label="Round score">
            <div className="score-card__top">
              <p className="score-card__kicker">Tonight&apos;s field log</p>
              <span className="score-card__moon" aria-hidden="true" />
            </div>
            <p className="score-card__label">Fireflies caught</p>
            <p className="score-value">
              <strong>{game.caughtCount}</strong>
              <span> / {CATCH_TARGETS.length} caught</span>
            </p>
            <div
              className="progress-track"
              role="img"
              aria-label={`${game.caughtCount} of ${CATCH_TARGETS.length} fireflies caught`}
            >
              {CATCH_TARGETS.map((target, index) => (
                <span
                  className={`progress-track__dot${index < game.caughtCount ? ' is-caught' : ''}`}
                  key={target.id}
                />
              ))}
            </div>
            <p className="score-card__tip">
              {game.phase === 'complete'
                ? 'A little more light in the world.'
                : game.phase === 'playing'
                  ? 'No rush. The grove will wait.'
                  : 'Every glow has its own little place.'}
            </p>
          </aside>

          <section
            className={`meadow meadow--${game.phase}`}
            aria-label="Moonlit meadow"
          >
            <div className="meadow__scenery" aria-hidden="true">
              <span className="meadow__moon" />
              <span className="meadow__star meadow__star--one" />
              <span className="meadow__star meadow__star--two" />
              <span className="meadow__star meadow__star--three" />
              <span className="meadow__star meadow__star--four" />
              <span className="meadow__star meadow__star--five" />
              <span className="meadow__glow" />
              <span className="meadow__ridge meadow__ridge--far" />
              <span className="meadow__ridge meadow__ridge--middle" />
              <span className="meadow__ridge meadow__ridge--near" />
            </div>

            <p className="meadow__caption">
              <span className="meadow__caption-dot" aria-hidden="true" />
              The grove after dusk
            </p>

            {game.phase === 'ready' && (
              <div className="state-card">
                <p className="state-card__eyebrow">Take a quiet breath</p>
                <h2>Find the first light</h2>
                <p>
                  Catch all five fireflies and let the whole meadow glow.
                </p>
                <button
                  className="primary-action"
                  onClick={() => setGame(startGame())}
                  type="button"
                >
                  Start catching
                </button>
              </div>
            )}

            {game.phase === 'playing' && currentTarget && (
              <>
                <p className="meadow__hint">
                  A little {currentTarget.color} glow is resting near the{' '}
                  {currentTarget.landmark}.
                </p>
                <button
                  aria-label={`Catch the ${currentTarget.color} firefly`}
                  className={`firefly firefly--${currentTarget.position} firefly--${currentTarget.tone}`}
                  onClick={() => setGame((state) => catchFirefly(state))}
                  type="button"
                >
                  <span className="firefly__body" aria-hidden="true" />
                </button>
              </>
            )}

            {game.phase === 'complete' && (
              <div className="state-card state-card--complete">
                <p className="state-card__eyebrow">All five, found</p>
                <h2>The grove is glowing</h2>
                <p>
                  You caught every firefly. The whole meadow feels a little
                  brighter.
                </p>
                <button
                  className="primary-action"
                  onClick={() => setGame(resetGame())}
                  type="button"
                >
                  Play again
                </button>
              </div>
            )}
          </section>
        </div>

        <p className="visually-hidden" role="status" aria-live="polite" aria-atomic="true">
          {announcement}
        </p>
      </main>

      <footer className="game-footer">
        <p className="game-footer__note">A small game for a slower evening.</p>
        <p className="game-footer__keys">
          <kbd>Tab</kbd> to focus
          <span aria-hidden="true">·</span>
          <kbd>Enter</kbd> or <kbd>Space</kbd> to catch
        </p>
      </footer>
    </div>
  )
}

export default GlowGroveGame
