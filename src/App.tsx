import { useState } from 'react'
import { GAME_CATALOG } from './gameCatalog'
import LanguageSwitcher from './LanguageSwitcher'
import type { GameCatalogEntry } from './gameTypes'
import { useLanguage } from './useLanguage'
import './App.css'
import './Menu.css'

function App() {
  const [activeGame, setActiveGame] = useState<GameCatalogEntry | null>(null)
  const { t } = useLanguage()

  if (activeGame) {
    const Game = activeGame.component
    return <Game onBackToMenu={() => setActiveGame(null)} />
  }

  const gameCountKey =
    GAME_CATALOG.length === 1 ? 'menu.gamesReady.one' : 'menu.gamesReady.many'
  const availableCountKey =
    GAME_CATALOG.length === 1
      ? 'menu.availableCount.one'
      : 'menu.availableCount.many'

  return (
    <div className="app-shell">
      <header className="topline">
        <div className="wordmark">
          <span className="wordmark__spark" aria-hidden="true" />
          <span className="wordmark__name">Night Garden</span>
        </div>
        <div className="topline__actions">
          <p className="topline__tag">
            {t(gameCountKey, { count: GAME_CATALOG.length })}
          </p>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="menu-page" aria-labelledby="menu-title">
        <section className="menu-intro">
          <p className="menu-intro__eyebrow">
            <span className="menu-intro__spark" aria-hidden="true" />
            {t('menu.eyebrow')}
          </p>
          <h1 id="menu-title">
            {t('menu.titleLead')}
            {t('menu.titleJoiner')}
            <span>{t('menu.titleAccent')}</span>
          </h1>
          <p className="menu-intro__copy">{t('menu.intro')}</p>
        </section>

        <section className="game-library" aria-labelledby="game-library-title">
          <div className="game-library__heading">
            <h2 id="game-library-title">{t('menu.available')}</h2>
            <span>
              {t(availableCountKey, { count: GAME_CATALOG.length })}
            </span>
          </div>
          <div className="game-grid">
            {GAME_CATALOG.map((game, index) => {
              const title = t(game.copy.title)
              const category = t(game.copy.category)

              return (
                <article className="game-card" key={game.id}>
                  <div
                    className={`game-card__art game-card__art--${game.artwork}`}
                    aria-hidden="true"
                  >
                    {game.artwork === 'meadow' ? (
                      <>
                        <span className="game-card__moon" />
                        <span className="game-card__star game-card__star--one" />
                        <span className="game-card__star game-card__star--two" />
                        <span className="game-card__star game-card__star--three" />
                        <span className="game-card__ridge game-card__ridge--back" />
                        <span className="game-card__ridge game-card__ridge--front" />
                        <span className="game-card__firefly" />
                      </>
                    ) : (
                      <>
                        <span className="game-card__breakout-glow" />
                        <div className="game-card__breakout-bricks">
                          {Array.from({ length: 40 }, (_, brickIndex) => (
                            <span
                              className="game-card__breakout-brick"
                              data-row={Math.floor(brickIndex / 8)}
                              key={brickIndex}
                            />
                          ))}
                        </div>
                        <span className="game-card__breakout-ball" />
                        <span className="game-card__breakout-paddle" />
                      </>
                    )}
                    <span className="game-card__art-label">{category}</span>
                  </div>

                  <div className="game-card__content">
                    <p className="game-card__eyebrow">
                      {String(index + 1).padStart(2, '0')} / {category}
                    </p>
                    <h3 className="game-card__title">{title}</h3>
                    <p className="game-card__tagline">
                      {t(game.copy.tagline)}
                    </p>
                    <p className="game-card__description">
                      {t(game.copy.description)}
                    </p>
                    <div className="game-card__footer">
                      <p className="game-card__details">
                        {t(game.copy.details)}
                      </p>
                      <button
                        className="primary-action"
                        onClick={() => setActiveGame(game)}
                        type="button"
                      >
                        {t('menu.play', { game: title })}
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </main>

      <footer className="menu-footer">
        <p>{t('menu.footer.left')}</p>
        <p>{t('menu.footer.right')}</p>
      </footer>
    </div>
  )
}

export default App
