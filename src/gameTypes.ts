import type { ComponentType } from 'react'

export interface GameComponentProps {
  onBackToMenu: () => void
}

export interface GameCatalogEntry {
  id: string
  title: string
  category: string
  tagline: string
  description: string
  details: string
  component: ComponentType<GameComponentProps>
}
