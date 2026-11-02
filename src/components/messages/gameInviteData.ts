export type MiniGameId = 'tic-tac-toe' | 'memory-match' | 'rock-paper-scissors'

export interface GameInvitationPayload {
  gameId: MiniGameId
  gameName: string
  conversationName: string
  createdAt: string
}

export interface GameResultPayload {
  gameId: MiniGameId
  gameName: string
  result: string
  createdAt: string
}

export const GAME_INVITE_PREFIX = 'oyoconnect:game-invite:'
export const GAME_RESULT_PREFIX = 'oyoconnect:game-result:'

export const miniGames: { id: MiniGameId; name: string; description: string; players: string; category: string }[] = [
  { id: 'tic-tac-toe', name: 'Tic-Tac-Toe', description: 'A quick, turn-by-turn classic for two people sharing this device.', players: '2 · pass and play', category: 'Strategy' },
  { id: 'memory-match', name: 'Memory Match', description: 'Find every matching pair at your own pace.', players: '1 · local play', category: 'Puzzle' },
  { id: 'rock-paper-scissors', name: 'Rock Paper Scissors', description: 'Take turns choosing, then reveal both choices on this device.', players: '2 · pass and play', category: 'Quick play' },
]

export function encodeGameInvitation(invite: GameInvitationPayload): string {
  return `${GAME_INVITE_PREFIX}${JSON.stringify(invite)}`
}

export function parseGameInvitation(content: string): GameInvitationPayload | null {
  if (!content.startsWith(GAME_INVITE_PREFIX)) return null
  try {
    const value = JSON.parse(content.slice(GAME_INVITE_PREFIX.length)) as Partial<GameInvitationPayload>
    const game = miniGames.find((item) => item.id === value.gameId)
    if (!game || typeof value.conversationName !== 'string' || typeof value.createdAt !== 'string') return null
    return { gameId: game.id, gameName: game.name, conversationName: value.conversationName, createdAt: value.createdAt }
  } catch {
    return null
  }
}

export function encodeGameResult(value: GameResultPayload): string {
  return `${GAME_RESULT_PREFIX}${JSON.stringify(value)}`
}

export function parseGameResult(content: string): GameResultPayload | null {
  if (!content.startsWith(GAME_RESULT_PREFIX)) return null
  try {
    const value = JSON.parse(content.slice(GAME_RESULT_PREFIX.length)) as Partial<GameResultPayload>
    const game = miniGames.find((item) => item.id === value.gameId)
    if (!game || typeof value.result !== 'string' || typeof value.createdAt !== 'string') return null
    return { gameId: game.id, gameName: game.name, result: value.result, createdAt: value.createdAt }
  } catch {
    return null
  }
}
