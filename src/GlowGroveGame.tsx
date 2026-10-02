import { useState } from 'react'
import {
  CATCH_TARGETS,
  catchFirefly,
  resetGame,
  startGame,
  type GameState,
} from './gameState'
import type { GameComponentProps } from './gameTypes'
import LanguageSwitcher from './LanguageSwitcher'
import type { TranslationKey } from './i18n'
import { useLanguage } from './useLanguage'
import './App.css'

const landmarkMessageKeys = {
  willow: 'glow.landmark.willow',
  fern: 'glow.landmark.fern',
  pond: 'glow.landmark.pond',
  clover: 'glow.landmark.clover',
  hill: 'glow.landmark.hill',
} satisfies Record<(typeof CATCH_TARGETS)[number]['id'], TranslationKey>

function GlowGroveGame({ onBackToMenu }: GameComponentProps) {
  const { t } = useLanguage()
  const [game, setGame] = useState<GameState>(resetGame)
  const currentTarget =
    game.phase === 'playing' ? CATCH_TARGETS[game.caughtCount] : undefined
  const announcement =
    game.phase === 'complete'
      ? t('glow.announcement.complete')
      : game.caughtCount > 0
        ? t('glow.announcement.progress', {
            caught: game.caughtCount,
            total: CATCH_TARGETS.length,
          })
        : ''
  const hintColorKey =
    currentTarget?.color === 'amber'
      ? 'glow.color.amber'
      : 'glow.color.mint'
  const catchButtonKey =
    currentTarget?.color === 'amber'
      ? 'glow.catch.amber'
      : 'glow.catch.mint'
  const hint =
    currentTarget &&
    t('glow.hint', {
      color: t(hintColorKey),
      landmark: t(landmarkMessageKeys[currentTarget.id]),
    })

  return (
    <div className="app-shell">
      <header className="topline">
        <div className="wordmark">
          <span className="wordmark__spark" aria-hidden="true" />
          <span className="wordmark__name">Glow Grove</span>
        </div>
        <div className="topline__actions">
          <LanguageSwitcher />
          <button
            aria-label={t('glow.back')}
            className="topline__back"
            onClick={onBackToMenu}
            type="button"
          >
            <span className="topline__back-arrow" aria-hidden="true">
              ←
            </span>
            {t('glow.back')}
          </button>
        </div>
      </header>

      <main className="game-page" aria-labelledby="game-title">
        <header className="intro">
          <p className="intro__eyebrow">
            <span className="intro__asterisk" aria-hidden="true" />
            {t('glow.eyebrow')}
          </p>
          <h1 id="game-title">
            Glow <span>Grove</span>
          </h1>
          <p className="intro__copy">{t('glow.intro')}</p>
        </header>

        <div className="game-layout">
          <aside className="score-card" aria-label={t('glow.score.aria')}>
            <div className="score-card__top">
              <p className="score-card__kicker">
                {t('glow.score.kicker')}
              </p>
              <span className="score-card__moon" aria-hidden="true" />
            </div>
            <p className="score-card__label">{t('glow.score.label')}</p>
            <p className="score-value">
              <strong>{game.caughtCount}</strong>
              <span>
                {t('glow.score.suffix', { total: CATCH_TARGETS.length })}
              </span>
            </p>
            <div
              className="progress-track"
              role="img"
              aria-label={t('glow.score.progress', {
                caught: game.caughtCount,
                total: CATCH_TARGETS.length,
              })}
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
                ? t('glow.score.tip.complete')
                : game.phase === 'playing'
                  ? t('glow.score.tip.playing')
                  : t('glow.score.tip.ready')}
            </p>
          </aside>

          <section
            className={`meadow meadow--${game.phase}`}
            aria-label={t('glow.scene.aria')}
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
              {t('glow.scene.caption')}
            </p>

            {game.phase === 'ready' && (
              <div className="state-card">
                <p className="state-card__eyebrow">
                  {t('glow.ready.kicker')}
                </p>
                <h2>{t('glow.ready.title')}</h2>
                <p>{t('glow.ready.body')}</p>
                <button
                  className="primary-action"
                  onClick={() => setGame(startGame())}
                  type="button"
                >
                  {t('glow.ready.button')}
                </button>
              </div>
            )}

            {game.phase === 'playing' && currentTarget && (
              <>
                <p className="meadow__hint">{hint}</p>
                <button
                  aria-label={t(catchButtonKey)}
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
                <p className="state-card__eyebrow">
                  {t('glow.complete.kicker')}
                </p>
                <h2>{t('glow.complete.title')}</h2>
                <p>{t('glow.complete.body')}</p>
                <button
                  className="primary-action"
                  onClick={() => setGame(resetGame())}
                  type="button"
                >
                  {t('glow.complete.button')}
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
        <p className="game-footer__note">{t('glow.footer.note')}</p>
        <p className="game-footer__keys">
          <kbd>Tab</kbd> {t('glow.footer.focus')}
          <span aria-hidden="true">·</span>
          <kbd>Enter</kbd> {t('glow.footer.or')} <kbd>Space</kbd>{' '}
          {t('glow.footer.catch')}
        </p>
      </footer>
    </div>
  )
}

export default GlowGroveGame
