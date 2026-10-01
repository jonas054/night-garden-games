import GlowGroveGame from './GlowGroveGame'
import type { GameCatalogEntry } from './gameTypes'

export const GAME_CATALOG: readonly GameCatalogEntry[] = [
  {
    id: 'glow-grove',
    title: 'Glow Grove',
    category: 'Moonlit meadow',
    tagline: 'Catch a little light.',
    description: 'Follow five fireflies across a softly glowing meadow.',
    details: '5 fireflies · No timer',
    component: GlowGroveGame,
  },
]
