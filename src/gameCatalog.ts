import BreakoutGame from './BreakoutGame'
import GlowGroveGame from './GlowGroveGame'
import type { GameCatalogEntry } from './gameTypes'

export const GAME_CATALOG: readonly GameCatalogEntry[] = [
  {
    id: 'glow-grove',
    artwork: 'meadow',
    title: 'Glow Grove',
    category: 'Moonlit meadow',
    tagline: 'Catch a little light.',
    description: 'Follow five fireflies across a softly glowing meadow.',
    details: '5 fireflies · No timer',
    component: GlowGroveGame,
  },
  {
    id: 'moonlit-breakout',
    artwork: 'breakout',
    title: 'Moonlit Breakout',
    category: 'Moonlit arcade',
    tagline: 'A glow, a paddle, one more bounce.',
    description:
      'Bounce a moonlit ball through five rows of glowing bricks.',
    details: '40 bricks · 3 lives',
    component: BreakoutGame,
  },
]
