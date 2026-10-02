import BreakoutGame from './BreakoutGame'
import GlowGroveGame from './GlowGroveGame'
import type { GameCatalogEntry } from './gameTypes'

export const GAME_CATALOG: readonly GameCatalogEntry[] = [
  {
    id: 'glow-grove',
    artwork: 'meadow',
    copy: {
      title: 'catalog.glow.title',
      category: 'catalog.glow.category',
      tagline: 'catalog.glow.tagline',
      description: 'catalog.glow.description',
      details: 'catalog.glow.details',
    },
    component: GlowGroveGame,
  },
  {
    id: 'moonlit-breakout',
    artwork: 'breakout',
    copy: {
      title: 'catalog.breakout.title',
      category: 'catalog.breakout.category',
      tagline: 'catalog.breakout.tagline',
      description: 'catalog.breakout.description',
      details: 'catalog.breakout.details',
    },
    component: BreakoutGame,
  },
]
