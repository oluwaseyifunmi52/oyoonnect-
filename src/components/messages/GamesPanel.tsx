import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  Check,
  Clock3,
  CreditCard,
  Gamepad2,
  Gift,
  RotateCcw,
  Search,
  Sparkles,
  Trophy,
  UsersRound,
  X,
} from 'lucide-react'
import './GamesPanel.css'
import { miniGames, type GameInvitationPayload, type GameResultPayload, type MiniGameId } from './gameInviteData'

interface GamesPanelProps {
  conversationName: string
  onClose: () => void
  onCreateInvitation: (_game: (typeof miniGames)[number]) => void
  onShareResult: (_result: Pick<GameResultPayload, 'gameId' | 'result'>) => void
  launchGameId?: MiniGameId | null
}

type GamesSection = 'play' | 'challenges' | 'credits' | 'gift-cards' | 'subscriptions' | 'recent'

const sections: { id: GamesSection; label: string }[] = [
  { id: 'play', label: 'Play together' },
  { id: 'challenges', label: 'Challenges' },
  { id: 'credits', label: 'Game credits' },
  { id: 'gift-cards', label: 'Gift cards' },
  { id: 'subscriptions', label: 'Subscriptions' },
  { id: 'recent', label: 'Recent games' },
]

export function GameInvitationCard({
  invite,
  status,
  onAccept,
  onDecline,
}: {
  invite: GameInvitationPayload
  status: 'pending' | 'accepted' | 'declined'
  onAccept: () => void
  onDecline: () => void
}) {
  return (
    <article className="message-game-invite" aria-label={`${invite.gameName} invitation preview`}>
      <div className="message-game-invite__icon"><Gamepad2 size={18} /></div>
      <div className="message-game-invite__body">
        <strong>{invite.gameName}</strong>
        <span>Play together · {invite.conversationName}</span>
        <small>Local message preview · not delivered to another user</small>
        {status === 'pending' ? (
          <div className="message-game-invite__actions">
            <button type="button" onClick={onAccept}>Accept on this device</button>
            <button type="button" onClick={onDecline}>Decline preview</button>
          </div>
        ) : (
          <span className="message-game-invite__status">{status === 'accepted' ? 'Accepted locally · not delivered' : 'Declined locally · not delivered'}</span>
        )}
      </div>
    </article>
  )
}

export function GameResultCard({ result }: { result: GameResultPayload }) {
  return (
    <article className="message-game-result" aria-label={`${result.gameName} result preview`}>
      <Trophy size={18} />
      <div><strong>{result.gameName} result</strong><span>{result.result}</span><small>Local result preview · not delivered to another user</small></div>
    </article>
  )
}

function findWinner(board: (string | null)[]): string | null {
  const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]
  for (const [a, b, c] of lines) if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a]
  return null
}

function TicTacToe({ onExit, onResult }: { onExit: () => void; onResult: (_result: string) => void }) {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null))
  const [turn, setTurn] = useState('X')
  const [score, setScore] = useState({ X: 0, O: 0, draws: 0 })
  const winner = findWinner(board)
  const draw = !winner && board.every(Boolean)

  const play = (index: number) => {
    if (board[index] || winner || draw) return
    const next = [...board]
    next[index] = turn
    setBoard(next)
    const nextWinner = findWinner(next)
    if (nextWinner) { setScore((current) => ({ ...current, [nextWinner]: current[nextWinner as 'X' | 'O'] + 1 })); onResult(`Player ${nextWinner === 'X' ? '1' : '2'} wins`) }
    else if (next.every(Boolean)) { setScore((current) => ({ ...current, draws: current.draws + 1 })); onResult('Draw') }
    else setTurn(turn === 'X' ? 'O' : 'X')
  }

  const rematch = () => { setBoard(Array(9).fill(null)); setTurn('X') }
  return (
    <div className="games-local-game">
      <div className="games-local-game__top"><button type="button" onClick={onExit}><ArrowLeft size={16} /> Back to games</button><span>Pass and play · this device</span></div>
      <h3>Tic-Tac-Toe</h3>
      <p>{winner ? `Player ${winner === 'X' ? '1' : '2'} wins` : draw ? 'It’s a draw' : `Player ${turn === 'X' ? '1' : '2'}’s turn`}</p>
      <div className="games-ttt-board" role="grid" aria-label="Tic-Tac-Toe board">{board.map((mark, index) => <button key={index} type="button" role="gridcell" aria-label={`Cell ${index + 1}${mark ? `, ${mark}` : ', empty'}`} disabled={Boolean(mark || winner || draw)} onClick={() => play(index)}>{mark}</button>)}</div>
      <div className="games-score"><span>Player 1 <strong>{score.X}</strong></span><span>Draws <strong>{score.draws}</strong></span><span>Player 2 <strong>{score.O}</strong></span></div>
      <button className="games-secondary-button" type="button" onClick={rematch}><RotateCcw size={15} /> Rematch</button>
    </div>
  )
}

function MemoryMatch({ onExit, onResult }: { onExit: () => void; onResult: (_result: string) => void }) {
  const symbols = ['🌿', '⚽', '🪘', '🎮', '🍊', '⭐']
  const [cards, setCards] = useState(() => [...symbols, ...symbols].map((symbol, index) => ({ symbol, key: `${symbol}-${index}`, id: symbol })).sort(() => Math.random() - 0.5))
  const [open, setOpen] = useState<number[]>([])
  const [matched, setMatched] = useState<string[]>([])
  const [moves, setMoves] = useState(0)
  const complete = matched.length === symbols.length

  const flip = (index: number) => {
    if (open.length >= 2 || open.includes(index) || matched.includes(cards[index].id)) return
    if (!open.length) { setOpen([index]); return }
    const pair = [open[0], index]
    setOpen(pair)
    setMoves((value) => value + 1)
    const isMatch = cards[pair[0]].id === cards[pair[1]].id
    if (isMatch) {
      setMatched((value) => [...value, cards[index].id])
      if (matched.length + 1 === symbols.length) onResult(`Completed in ${moves + 1} moves`)
      setTimeout(() => setOpen([]), 450)
    } else {
      setTimeout(() => setOpen([]), 750)
    }
  }

  const reset = () => { setCards((value) => [...value].sort(() => Math.random() - 0.5)); setOpen([]); setMatched([]); setMoves(0) }
  return (
    <div className="games-local-game">
      <div className="games-local-game__top"><button type="button" onClick={onExit}><ArrowLeft size={16} /> Back to games</button><span>Solo · this device</span></div>
      <h3>Memory Match</h3>
      <p>{complete ? `All pairs found in ${moves} moves` : `Find the pairs · ${moves} moves`}</p>
      <div className="games-memory-board">{cards.map((card, index) => <button key={card.key} type="button" aria-label={open.includes(index) || matched.includes(card.id) ? card.symbol : `Hidden card ${index + 1}`} disabled={open.length >= 2 || matched.includes(card.id)} onClick={() => flip(index)}>{open.includes(index) || matched.includes(card.id) ? card.symbol : '•'}</button>)}</div>
      <button className="games-secondary-button" type="button" onClick={reset}><RotateCcw size={15} /> {complete ? 'Play again' : 'Restart'}</button>
    </div>
  )
}

function RockPaperScissors({ onExit, onResult }: { onExit: () => void; onResult: (_result: string) => void }) {
  const choices = ['Rock', 'Paper', 'Scissors'] as const
  const [round, setRound] = useState<1 | 2>(1)
  const [first, setFirst] = useState<(typeof choices)[number] | null>(null)
  const [second, setSecond] = useState<(typeof choices)[number] | null>(null)
  const [score, setScore] = useState({ first: 0, second: 0, draws: 0 })
  const result = first && second
    ? first === second ? 'Round draw' : (first === 'Rock' && second === 'Scissors') || (first === 'Paper' && second === 'Rock') || (first === 'Scissors' && second === 'Paper') ? 'Player 1 wins this round' : 'Player 2 wins this round'
    : null
  const pick = (choice: (typeof choices)[number]) => {
    if (first && second) return
    if (round === 1) { setFirst(choice); setSecond(null); setRound(2); return }
    setSecond(choice)
    const playerOneWon = (first === 'Rock' && choice === 'Scissors') || (first === 'Paper' && choice === 'Rock') || (first === 'Scissors' && choice === 'Paper')
    setScore((current) => first === choice ? { ...current, draws: current.draws + 1 } : playerOneWon ? { ...current, first: current.first + 1 } : { ...current, second: current.second + 1 })
    onResult(first === choice ? 'Round draw' : playerOneWon ? 'Player 1 wins this round' : 'Player 2 wins this round')
  }
  const rematch = () => { setFirst(null); setSecond(null); setRound(1) }
  return (
    <div className="games-local-game">
      <div className="games-local-game__top"><button type="button" onClick={onExit}><ArrowLeft size={16} /> Back to games</button><span>Pass and play · this device</span></div>
      <h3>Rock Paper Scissors</h3>
      <p>{result ?? `Player ${round} choose`}</p>
      {result ? <div className="games-rps-reveal">Player 1: {first} <span>vs</span> Player 2: {second}</div> : null}
      <div className="games-rps-choices">{choices.map((choice) => <button key={choice} type="button" onClick={() => pick(choice)}>{choice}</button>)}</div>
      <div className="games-score"><span>Player 1 <strong>{score.first}</strong></span><span>Draws <strong>{score.draws}</strong></span><span>Player 2 <strong>{score.second}</strong></span></div>
      <button className="games-secondary-button" type="button" onClick={rematch}><RotateCcw size={15} /> {result ? 'Next round' : 'Restart round'}</button>
    </div>
  )
}

export default function GamesPanel({ conversationName, onClose, onCreateInvitation, onShareResult, launchGameId }: GamesPanelProps) {
  const [section, setSection] = useState<GamesSection>('play')
  const [search, setSearch] = useState('')
  const [selectedGame, setSelectedGame] = useState<MiniGameId | null>(null)
  const [playingGame, setPlayingGame] = useState<MiniGameId | null>(null)
  const [recent, setRecent] = useState<string[]>([])
  const filteredGames = useMemo(() => miniGames.filter((game) => `${game.name} ${game.description} ${game.category}`.toLowerCase().includes(search.toLowerCase())), [search])
  const selected = miniGames.find((game) => game.id === selectedGame)

  useEffect(() => {
    if (launchGameId) { setSection('play'); setSelectedGame(launchGameId); setPlayingGame(launchGameId) }
  }, [launchGameId])

  const startGame = (id: MiniGameId) => {
    setSelectedGame(id)
    setPlayingGame(id)
    setRecent((items) => [miniGames.find((game) => game.id === id)?.name ?? id, ...items.filter((name) => name !== miniGames.find((game) => game.id === id)?.name)].slice(0, 5))
  }

  return (
    <section className="messages-games-panel" aria-label="Games and entertainment">
      <header className="messages-games-panel__header"><div><span className="messages-games-panel__eyebrow"><Sparkles size={13} /> IN THIS CONVERSATION</span><h2>Games &amp; entertainment</h2><p>Local games work on this device. Invites are previews only.</p></div><button type="button" className="messages-games-panel__close" aria-label="Close games panel" onClick={onClose}><X size={19} /></button></header>
      <label className="messages-games-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search games and entertainment" aria-label="Search games and entertainment" /></label>
      <nav className="messages-games-tabs" aria-label="Games and entertainment categories">{sections.map((item) => <button key={item.id} type="button" className={section === item.id ? 'is-active' : ''} aria-pressed={section === item.id} onClick={() => { setSection(item.id); setPlayingGame(null); setSelectedGame(null) }}>{item.label}</button>)}</nav>

      {playingGame ? <div className="messages-games-panel__content">{playingGame === 'tic-tac-toe' ? <TicTacToe onExit={() => setPlayingGame(null)} onResult={(result) => onShareResult({ gameId: playingGame, result })} /> : playingGame === 'memory-match' ? <MemoryMatch onExit={() => setPlayingGame(null)} onResult={(result) => onShareResult({ gameId: playingGame, result })} /> : <RockPaperScissors onExit={() => setPlayingGame(null)} onResult={(result) => onShareResult({ gameId: playingGame, result })} />}</div> : section === 'play' ? (
        <div className="messages-games-panel__content">
          <div className="messages-games-grid">{filteredGames.map((game) => <article className="messages-game-card" key={game.id}><div className="messages-game-card__icon"><Gamepad2 size={19} /></div><div className="messages-game-card__copy"><span>{game.category}</span><strong>{game.name}</strong><p>{game.description}</p><small><UsersRound size={13} /> {game.players}</small></div><button type="button" onClick={() => { setSelectedGame(game.id); setPlayingGame(null) }}>Preview</button></article>)}</div>
          {selected && <div className="messages-game-preview"><div><span>GAME PREVIEW</span><h3>{selected.name}</h3><p>{selected.description}</p><small>Current conversation: {conversationName} · {selected.players}</small></div><div className="messages-game-preview__actions"><button type="button" onClick={() => startGame(selected.id)}><Gamepad2 size={15} /> Play locally</button><button type="button" className="is-secondary" onClick={() => onCreateInvitation(selected)}><UsersRound size={15} /> Add invite preview to chat</button></div><p className="messages-game-preview__notice">Invitations and accept/decline actions stay in this browser. They are not delivered or synchronized.</p></div>}
          {!filteredGames.length && <p className="messages-games-empty">No mini-games match your search.</p>}
        </div>
      ) : section === 'challenges' ? (
        <div className="messages-games-unavailable"><Trophy size={27} /><span>GAME CHALLENGES</span><h3>Challenge preview</h3><p>Choose a local game and add an invitation preview to this browser’s conversation. Sending a challenge to another OyoConnect user needs a game-invitation messaging API.</p><div className="messages-games-challenge-list">{miniGames.map((game) => <button key={game.id} type="button" onClick={() => { setSection('play'); setSelectedGame(game.id) }}><Gamepad2 size={15} /> Challenge to {game.name}</button>)}</div></div>
      ) : section === 'recent' ? (
        <div className="messages-games-unavailable"><Clock3 size={27} /><span>RECENT GAMES</span><h3>{recent.length ? 'Played in this session' : 'No recent games yet'}</h3><p>{recent.length ? 'These games were opened locally on this device. Results are not saved to your account.' : 'Games you play locally in this panel appear here for this session.'}</p>{recent.map((name, index) => <div className="messages-games-recent" key={`${name}-${index}`}><Check size={15} />{name}<small>Local session</small></div>)}</div>
      ) : (
        <div className="messages-games-unavailable"><div className="messages-games-unavailable__icon">{section === 'credits' ? <CreditCard size={24} /> : section === 'gift-cards' ? <Gift size={24} /> : <Sparkles size={24} />}</div><span>{section === 'credits' ? 'GAME CREDITS' : section === 'gift-cards' ? 'GIFT CARDS' : 'SUBSCRIPTIONS'}</span><h3>Verified products aren’t connected</h3><p>There is no live, provider-verified catalogue or checkout for this category in the existing app. Demo prices are intentionally not shown, and no purchase can be started here.</p><small>When a supported catalogue is connected, product names, denominations, and prices can appear in this conversation.</small></div>
      )}
      <footer className="messages-games-panel__footer"><Gamepad2 size={14} /> Local multiplayer uses one shared device; online sync needs backend game-session support.</footer>
    </section>
  )
}
