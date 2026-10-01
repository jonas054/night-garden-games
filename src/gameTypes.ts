import type { ComponentType } from 'react'

export type GameArtwork = 'meadow' | 'breakout'

export interface GameComponentProps {
  onBackToMenu: () => void
}

export interface GameCatalogEntry {
  id: string
  artwork: GameArtwork
  title: string
  category: string
  tagline: string
  description: string
  details: string
  component: ComponentType<GameComponentProps>
}
