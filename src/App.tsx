import { useState } from 'react'
import { GAME_CATALOG } from './gameCatalog'
import type { GameCatalogEntry } from './gameTypes'
import './App.css'
import './Menu.css'

function App() {
  const [activeGame, setActiveGame] = useState<GameCatalogEntry | null>(null)

  if (activeGame) {
    const Game = activeGame.component
    return <Game onBackToMenu={() => setActiveGame(null)} />
  }

  const gameCountLabel = `${GAME_CATALOG.length} ${
    GAME_CATALOG.length === 1 ? 'game' : 'games'
  } ready`

  return (
    <div className="app-shell">
      <header className="topline">
        <div className="wordmark">
          <span className="wordmark__spark" aria-hidden="true" />
          <span className="wordmark__name">Night Garden</span>
        </div>
        <p className="topline__tag">{gameCountLabel}</p>
      </header>

      <main className="menu-page" aria-labelledby="menu-title">
        <section className="menu-intro">
          <p className="menu-intro__eyebrow">
            <span className="menu-intro__spark" aria-hidden="true" />
            Small games, softer evenings
          </p>
          <h1 id="menu-title">
            Choose a <span>game</span>
          </h1>
          <p className="menu-intro__copy">
            Pick a little world to step into. More can join the shelf anytime.
          </p>
        </section>

        <section className="game-library" aria-labelledby="game-library-title">
          <div className="game-library__heading">
            <h2 id="game-library-title">Available games</h2>
            <span>{GAME_CATALOG.length} ready to play</span>
          </div>
          <div className="game-grid">
            {GAME_CATALOG.map((game, index) => (
              <article className="game-card" key={game.id}>
                <div className="game-card__art" aria-hidden="true">
                  <span className="game-card__moon" />
                  <span className="game-card__star game-card__star--one" />
                  <span className="game-card__star game-card__star--two" />
                  <span className="game-card__star game-card__star--three" />
                  <span className="game-card__ridge game-card__ridge--back" />
                  <span className="game-card__ridge game-card__ridge--front" />
                  <span className="game-card__firefly" />
                  <span className="game-card__art-label">{game.category}</span>
                </div>

                <div className="game-card__content">
                  <p className="game-card__eyebrow">
                    {String(index + 1).padStart(2, '0')} / {game.category}
                  </p>
                  <h3 className="game-card__title">{game.title}</h3>
                  <p className="game-card__tagline">{game.tagline}</p>
                  <p className="game-card__description">{game.description}</p>
                  <div className="game-card__footer">
                    <p className="game-card__details">{game.details}</p>
                    <button
                      className="primary-action"
                      onClick={() => setActiveGame(game)}
                      type="button"
                    >
                      Play {game.title}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="menu-footer">
        <p>A small shelf of local games.</p>
        <p>No accounts, no rush, just play.</p>
      </footer>
    </div>
  )
}

export default App
