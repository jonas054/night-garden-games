export const CATCH_TARGETS = [
  {
    id: 'willow',
    position: 'willow',
    tone: 'gold',
    color: 'amber',
    landmark: 'willow edge',
  },
  {
    id: 'fern',
    position: 'fern',
    tone: 'mint',
    color: 'mint',
    landmark: 'fern hollow',
  },
  {
    id: 'pond',
    position: 'pond',
    tone: 'gold',
    color: 'amber',
    landmark: 'still pond',
  },
  {
    id: 'clover',
    position: 'clover',
    tone: 'mint',
    color: 'mint',
    landmark: 'clover patch',
  },
  {
    id: 'hill',
    position: 'hill',
    tone: 'gold',
    color: 'amber',
    landmark: 'moonlit hill',
  },
] as const

export type GamePhase = 'ready' | 'playing' | 'complete'

export interface GameState {
  phase: GamePhase
  caughtCount: number
}

export function resetGame(): GameState {
  return { phase: 'ready', caughtCount: 0 }
}

export function startGame(): GameState {
  return { phase: 'playing', caughtCount: 0 }
}

export function catchFirefly(state: GameState): GameState {
  if (state.phase !== 'playing') {
    return state
  }

  const caughtCount = Math.min(state.caughtCount + 1, CATCH_TARGETS.length)

  return {
    phase: caughtCount === CATCH_TARGETS.length ? 'complete' : 'playing',
    caughtCount,
  }
}
