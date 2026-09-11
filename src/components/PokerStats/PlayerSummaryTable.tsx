import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Filter } from 'lucide-react'
import type { PlayerStat } from '../../types/poker/types'
import { playerColor, playerColors } from './playerColor'
import Button from '../Button'

type SortKey = 'player' | 'sessions' | 'totalWinnings' | 'avgProfit' | 'highestSingleWinning' | 'roi'

type PlayerSummaryTableProps = {
  playerStats: PlayerStat[]
  selectedPlayers: string[]
  hoveredPlayer: string | null
  onHoverPlayer: (name: string | null) => void
  onTogglePlayer: (name: string) => void
  onClearPeople: () => void
  clearDisabled?: boolean
}

const COLUMNS: { key: SortKey; label: string; numeric?: boolean }[] = [
  { key: 'player', label: 'Player' },
  { key: 'sessions', label: 'Sessions', numeric: true },
  { key: 'totalWinnings', label: 'Total', numeric: true },
  { key: 'avgProfit', label: 'Avg / game', numeric: true },
  { key: 'highestSingleWinning', label: 'Best session', numeric: true },
  { key: 'roi', label: 'ROI', numeric: true },
]

export function PlayerSummaryTable({
  playerStats,
  selectedPlayers,
  hoveredPlayer,
  onHoverPlayer,
  onTogglePlayer,
  onClearPeople,
  clearDisabled = false,
}: PlayerSummaryTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('totalWinnings')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const filterInputRef = useRef<HTMLInputElement>(null)
  const menuId = useId()
  const filterActive = query.trim().length > 0

  const selectedSet = useMemo(() => new Set(selectedPlayers), [selectedPlayers])

  const colorsByPlayer = useMemo(
    () => playerColors(playerStats.map((stat) => stat.player)),
    [playerStats],
  )

  const maxAbs = useMemo(() => {
    if (playerStats.length === 0) return 1
    return Math.max(...playerStats.map((stat) => Math.abs(stat.totalWinnings)), 1)
  }, [playerStats])

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const filtered = needle
      ? playerStats.filter((stat) => stat.player.toLowerCase().includes(needle))
      : [...playerStats]

    filtered.sort((a, b) => {
      const left = a[sortKey]
      const right = b[sortKey]
      if (typeof left === 'string' && typeof right === 'string') {
        const cmp = left.localeCompare(right)
        return sortDir === 'asc' ? cmp : -cmp
      }
      const cmp = Number(left) - Number(right)
      return sortDir === 'asc' ? cmp : -cmp
    })
    return filtered
  }, [playerStats, sortKey, sortDir, query])

  useEffect(() => {
    if (!menuOpen) return

    function onPointerDown(event: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  useEffect(() => {
    if (menuOpen) filterInputRef.current?.focus()
  }, [menuOpen])

  function onSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((current) => (current === 'asc' ? 'desc' : 'asc'))
      return
    }
    setSortKey(key)
    setSortDir(key === 'player' ? 'asc' : 'desc')
  }

  return (
    <div>
      <div className="table-toolbar">
        <div className="table-menu" ref={menuRef}>
          <button
            type="button"
            className="table-menu__trigger"
            aria-label={filterActive ? 'Filter by name, filter active' : 'Filter by name'}
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Filter size={16} aria-hidden="true" />
            {filterActive ? <span className="table-menu__dot" aria-hidden="true" /> : null}
          </button>
          {menuOpen ? (
            <div className="table-menu__popover" id={menuId} role="dialog" aria-label="Filter by name">
              <label className="field">
                <span className="field__label">Filter by name</span>
                <input
                  ref={filterInputRef}
                  className="input"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Filter by name"
                  autoComplete="off"
                  spellCheck={false}
                />
              </label>
              <div className="table-menu__actions">
                <Button
                  label="Clear people"
                  variant="ghost"
                  onClick={() => {
                    onClearPeople()
                    setMenuOpen(false)
                  }}
                  disabled={clearDisabled}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div className="stats-table-wrap">
        <table className="stats-table">
          <thead>
            <tr>
              {COLUMNS.map((column) => {
                const active = sortKey === column.key
                return (
                  <th key={column.key} className={column.numeric ? 'is-num' : undefined} scope="col">
                    <button
                      type="button"
                      className="sort-btn"
                      onClick={() => onSort(column.key)}
                      aria-sort={active ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                    >
                      {column.label}
                      {active ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}
                    </button>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length}>
                  <p className="notice">No players match “{query.trim()}”.</p>
                </td>
              </tr>
            ) : (
              rows.map((stat) => {
                const color = playerColor(stat.player, colorsByPlayer)
                const barPct = Math.round((Math.abs(stat.totalWinnings) / maxAbs) * 100)
                const selected = selectedSet.has(stat.player)
                const hovered = hoveredPlayer === stat.player
                return (
                  <tr
                    key={stat.player}
                    className={
                      [selected ? 'is-selected' : null, hovered ? 'is-hovered' : null]
                        .filter(Boolean)
                        .join(' ') || undefined
                    }
                    role="button"
                    aria-label={`Plot ${stat.player}`}
                    aria-pressed={selected}
                    tabIndex={0}
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => onHoverPlayer(stat.player)}
                    onMouseLeave={() => onHoverPlayer(null)}
                    onClick={() => onTogglePlayer(stat.player)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        onTogglePlayer(stat.player)
                      }
                    }}
                  >
                    <td>
                      <span className="player-cell" style={{ ['--player-color' as string]: color }}>
                        <span className="player-dot" aria-hidden="true" />
                        {stat.player}
                      </span>
                    </td>
                    <td className="is-num">{stat.sessions}</td>
                    <td className="is-num">
                      <div className="pnl-cell">
                        <span className={moneyClass(stat.totalWinnings)}>
                          {formatSignedCurrency(stat.totalWinnings)}
                        </span>
                        <span className="pnl-bar" aria-hidden="true">
                          <span
                            className="pnl-bar__neg"
                            style={{ width: stat.totalWinnings < 0 ? `${barPct}%` : '0%' }}
                          />
                          <span
                            className="pnl-bar__pos"
                            style={{ width: stat.totalWinnings > 0 ? `${barPct}%` : '0%' }}
                          />
                        </span>
                      </div>
                    </td>
                    <td className={`is-num ${moneyClass(stat.avgProfit)}`}>
                      {formatSignedCurrency(stat.avgProfit)}
                    </td>
                    <td className={`is-num ${moneyClass(stat.highestSingleWinning)}`}>
                      {formatSignedCurrency(stat.highestSingleWinning)}
                    </td>
                    <td className={`is-num ${moneyClass(stat.roi)}`}>{formatSignedPercent(stat.roi)}</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function moneyClass(value: number): string {
  if (value > 0) return 'money money--up'
  if (value < 0) return 'money money--down'
  return 'money'
}

function formatSignedCurrency(value: number): string {
  const sign = value > 0 ? '+' : value < 0 ? '−' : ''
  return `${sign}$${Math.abs(value).toFixed(2)}`
}

function formatSignedPercent(value: number): string {
  const sign = value > 0 ? '+' : value < 0 ? '−' : ''
  return `${sign}${Math.abs(value).toFixed(1)}%`
}
