import type { ComponentType } from 'react'
import type { TranslationKey } from './i18n'

export type GameArtwork = 'meadow' | 'breakout'

export interface GameCopyKeys {
  title: TranslationKey
  category: TranslationKey
  tagline: TranslationKey
  description: TranslationKey
  details: TranslationKey
}

export interface GameComponentProps {
  onBackToMenu: () => void
}

export interface GameCatalogEntry {
  id: string
  artwork: GameArtwork
  copy: GameCopyKeys
  component: ComponentType<GameComponentProps>
}
