import { lazy, Suspense, useMemo, useState } from 'react'
import { PlayerSummaryTable } from '../../components/PokerStats/PlayerSummaryTable'
import Button from '../../components/Button'
import PageShell from '../../components/PageShell'
import SectionCard from '../../components/SectionCard'
import { useServices } from '../../context/ServicesContext'
import { usePokerStats } from '../../hooks/usePokerStats'
import type { YearFilter } from '../../types/poker/types'

const PerformanceChart = lazy(() => import('../../components/PokerStats/PerformanceChart'))

export function PokerStatsPage() {
  const { pokerService } = useServices()
  const [selectedYear, setSelectedYear] = useState<YearFilter>(() => new Date().getFullYear())
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([])
  const [hoveredPlayer, setHoveredPlayer] = useState<string | null>(null)
  const { data, isLoading, error } = usePokerStats()

  const sessions = useMemo(() => data?.sessions ?? [], [data?.sessions])

  const yearOptions = useMemo(() => {
    const years = new Set(pokerService.getAvailableYears(sessions))
    years.add(new Date().getFullYear())
    return [...years].sort((a, b) => b - a)
  }, [pokerService, sessions])

  const filteredSessions = useMemo(
    () => pokerService.filterSessionsByYear(sessions, selectedYear),
    [pokerService, sessions, selectedYear],
  )

  const playerStats = useMemo(
    () => pokerService.getPlayerStats(filteredSessions),
    [pokerService, filteredSessions],
  )

  const playerNames = useMemo(
    () => new Set(playerStats.map((stat) => stat.player)),
    [playerStats],
  )

  const focusPlayers = useMemo(
    () => selectedPlayers.filter((name) => playerNames.has(name)),
    [selectedPlayers, playerNames],
  )

  function togglePlayer(name: string) {
    setSelectedPlayers((current) =>
      current.includes(name) ? current.filter((player) => player !== name) : [...current, name],
    )
  }

  function clearPeople() {
    setSelectedPlayers([])
  }

  const sessionMeta = useMemo(() => {
    if (filteredSessions.length === 0) return null
    const dates = [...new Set(filteredSessions.map((session) => session.date.getTime()))]
      .sort((a, b) => a - b)
      .map((stamp) => new Date(stamp))
    const first = dates[0]
    const last = dates[dates.length - 1]
    const range = formatRange(first, last)
    const nightLabel = dates.length === 1 ? '1 night' : `${dates.length} nights`
    return `${nightLabel} · ${range}`
  }, [filteredSessions])

  if (isLoading) {
    return (
      <PageShell subtitle="Poker stats">
        <p className="status">Loading poker stats…</p>
      </PageShell>
    )
  }

  if (error) {
    return (
      <PageShell subtitle="Poker stats">
        <SectionCard title="Couldn’t load stats">
          <p className="notice notice--error">
            {error instanceof Error
              ? error.message
              : 'Failed to load poker stats. Make sure the Google Sheet is public.'}
          </p>
        </SectionCard>
      </PageShell>
    )
  }

  return (
    <PageShell subtitle="Poker stats">
      <div className="page-stack">
        <div className="filter-bar">
          <label className="field filter-year">
            <span className="field__label">Year</span>
            <span className="select-wrap">
              <select
                className="select"
                value={String(selectedYear)}
                onChange={(event) => {
                  const next = event.target.value
                  setSelectedYear(next === 'all' ? 'all' : Number(next))
                }}
              >
                <option value="all">All years</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </span>
          </label>
          {sessionMeta ? <p className="filter-meta">{sessionMeta}</p> : null}
        </div>

        {filteredSessions.length === 0 ? (
          <SectionCard title="No sessions">
            <p className="notice">
              Nothing for {selectedYear === 'all' ? 'all years' : selectedYear}. Try another year.
            </p>
          </SectionCard>
        ) : (
          <>
            <SectionCard
              title="Cumulative profit"
              actions={
                <Button
                  label="Clear people"
                  variant="ghost"
                  size="sm"
                  onClick={clearPeople}
                  disabled={focusPlayers.length === 0}
                />
              }
            >
              <Suspense fallback={<p className="notice">Loading chart…</p>}>
                <PerformanceChart
                  sessions={filteredSessions}
                  focusPlayers={focusPlayers}
                  hoveredPlayer={hoveredPlayer}
                  onHoverPlayer={setHoveredPlayer}
                  onTogglePlayer={togglePlayer}
                />
              </Suspense>
            </SectionCard>
            <SectionCard title="Player summary" className="stats-summary-card" noPadding>
              <PlayerSummaryTable
                playerStats={playerStats}
                selectedPlayers={focusPlayers}
                hoveredPlayer={hoveredPlayer}
                onHoverPlayer={setHoveredPlayer}
                onTogglePlayer={togglePlayer}
                onClearPeople={clearPeople}
                clearDisabled={focusPlayers.length === 0}
              />
            </SectionCard>
          </>
        )}
      </div>
    </PageShell>
  )
}

function formatRange(first: Date, last: Date): string {
  const sameYear = first.getFullYear() === last.getFullYear()
  const start = first.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: sameYear ? undefined : 'numeric',
  })
  const end = last.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  if (first.getTime() === last.getTime()) return end
  return `${start} – ${end}`
}
