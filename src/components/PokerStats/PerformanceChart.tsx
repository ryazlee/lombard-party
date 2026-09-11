import { useMemo } from 'react'
import Chart from 'react-apexcharts'
import type { ApexOptions } from 'apexcharts'
import type { PokerSession } from '../../types/poker/types'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useTheme } from '../../theme'
import { playerColor, playerColors, withAlpha } from './playerColor'
import Button from '../Button'

const MUTED_SERIES_ALPHA = 0.22

type PerformanceChartProps = {
  sessions: PokerSession[]
  focusPlayers: string[]
  hoveredPlayer: string | null
  onHoverPlayer: (name: string | null) => void
  onTogglePlayer: (name: string) => void
  onClearPeople: () => void
}

type SeriesPoint = {
  x: number
  y: number
  dayProfit: number
}

export default function PerformanceChart({
  sessions,
  focusPlayers,
  hoveredPlayer,
  onHoverPlayer,
  onTogglePlayer,
  onClearPeople,
}: PerformanceChartProps) {
  const { theme } = useTheme()
  const isMobile = useMediaQuery('(max-width: 767px)')
  const focused = focusPlayers.length > 0
  const chartHeight = isMobile ? 380 : 500

  const allPlayers = useMemo(
    () => [...new Set(sessions.map((session) => session.player))].sort((a, b) => a.localeCompare(b)),
    [sessions],
  )

  const colorsByPlayer = useMemo(() => playerColors(allPlayers), [allPlayers])

  const plottedPlayers = useMemo(
    () =>
      focused ? focusPlayers.filter((player) => allPlayers.includes(player)) : allPlayers,
    [focused, focusPlayers, allPlayers],
  )

  const seriesPlayers = useMemo(() => {
    if (
      hoveredPlayer &&
      allPlayers.includes(hoveredPlayer) &&
      !plottedPlayers.includes(hoveredPlayer)
    ) {
      return [...plottedPlayers, hoveredPlayer]
    }
    return plottedPlayers
  }, [allPlayers, hoveredPlayer, plottedPlayers])

  const allDates = useMemo(
    () =>
      [...new Set(sessions.map((session) => session.date.getTime()))]
        .sort((a, b) => a - b)
        .map((stamp) => new Date(stamp)),
    [sessions],
  )

  const dateLabels = useMemo(
    () =>
      allDates.map((date) =>
        date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
      ),
    [allDates],
  )

  const series = useMemo(
    () => buildSeries(seriesPlayers, sessions, allDates),
    [seriesPlayers, sessions, allDates],
  )

  const yRange = useMemo(() => {
    const values = buildSeries(plottedPlayers, sessions, allDates).flatMap((item) =>
      item.data.map((point) => point.y),
    )
    if (values.length === 0) return 100
    return Math.max(...values.map((value) => Math.abs(value))) + 5
  }, [plottedPlayers, sessions, allDates])

  const tokens = readChartTokens()
  const hovering = hoveredPlayer != null
  const colors = seriesPlayers.map((player) => {
    const color = playerColor(player, colorsByPlayer)
    if (hovering && player !== hoveredPlayer) return withAlpha(color, MUTED_SERIES_ALPHA)
    return color
  })
  const strokeWidth = focused ? (isMobile ? 3.25 : 4) : isMobile ? 2.25 : 3
  const markerSize = focused ? (isMobile ? 5.5 : 6.5) : isMobile ? 4 : 5
  const strokeWidths = seriesPlayers.map((player) => {
    if (!hovering) return strokeWidth
    return player === hoveredPlayer ? (isMobile ? 3.25 : 4) : isMobile ? 1.5 : 2
  })
  const markerSizes = seriesPlayers.map((player) => {
    if (!hovering) return markerSize
    return player === hoveredPlayer ? markerSize : Math.max(2, markerSize - 2)
  })

  const options: ApexOptions = {
    chart: {
      type: 'line',
      fontFamily: 'inherit',
      background: 'transparent',
      foreColor: tokens.muted,
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: hovering
        ? {
            enabled: false,
            dynamicAnimation: { enabled: false },
          }
        : {
            enabled: true,
            speed: 280,
            animateGradually: { enabled: true, delay: 18 },
            dynamicAnimation: { enabled: true, speed: 140 },
          },
    },
    colors,
    stroke: {
      curve: 'monotoneCubic',
      width: strokeWidths,
      lineCap: 'round',
    },
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } },
    },
    xaxis: {
      type: 'category',
      categories: dateLabels,
      tooltip: { enabled: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { fontSize: isMobile ? '10px' : '11px', colors: tokens.muted },
        rotate: isMobile ? -45 : 0,
        hideOverlappingLabels: true,
      },
      crosshairs: {
        show: true,
        width: 1,
        position: 'back',
        stroke: { color: tokens.border, width: 1, dashArray: 3 },
      },
    },
    yaxis: {
      min: -yRange,
      max: yRange,
      tickAmount: isMobile ? 4 : 6,
      labels: {
        formatter: (val) => `$${Math.round(val)}`,
        style: { colors: tokens.muted, fontSize: isMobile ? '10px' : '11px' },
      },
    },
    annotations: {
      yaxis: [
        {
          y: 0,
          borderColor: tokens.textSecondary,
          borderWidth: 1,
          strokeDashArray: 0,
          opacity: 0.55,
        },
      ],
    },
    legend: { show: false },
    tooltip: {
      enabled: true,
      shared: false,
      intersect: true,
      theme: theme === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
      followCursor: true,
      x: { show: false },
      custom: ({ seriesIndex, dataPointIndex }) => {
        if (dataPointIndex === undefined || dataPointIndex < 0 || seriesIndex === undefined) {
          return ''
        }

        const xValue = series[seriesIndex]?.data[dataPointIndex]?.x
        if (xValue === undefined || xValue < 0 || xValue >= allDates.length) return ''

        const date = allDates[xValue]
        const dateStr = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })

        const daySessions = new Map<string, number>()
        sessions.forEach((session) => {
          if (session.date.getTime() === date.getTime()) {
            daySessions.set(session.player, session.profit)
          }
        })

        if (daySessions.size === 0) return ''

        const rows = [...daySessions.entries()]
          .filter(([player]) => seriesPlayers.includes(player))
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([player, dayProfit]) => {
            const playerIndex = seriesPlayers.indexOf(player)
            const color = playerColor(player, colorsByPlayer)
            const cumulative = series[playerIndex]?.data.find((point) => point.x === xValue)?.y ?? 0
            const dayClass = dayProfit >= 0 ? 'money--up' : 'money--down'
            return `
              <div class="chart-tooltip__row">
                <span class="chart-tooltip__swatch" style="background:${color}"></span>
                <span class="chart-tooltip__name">${escapeHtml(player)}</span>
                <span class="chart-tooltip__day ${dayClass}">${formatSignedCurrency(dayProfit)}</span>
                <span class="chart-tooltip__cum">${formatSignedCurrency(Number(cumulative))}</span>
              </div>
            `
          })
          .join('')

        if (!rows) return ''

        return `
          <div class="chart-tooltip">
            <p class="chart-tooltip__date">${dateStr}</p>
            ${rows}
          </div>
        `
      },
    },
    markers: {
      size: markerSizes,
      strokeWidth: isMobile ? 1.5 : 2,
      strokeColors: tokens.surface,
      hover: { sizeOffset: 1 },
    },
    grid: {
      borderColor: tokens.border,
      strokeDashArray: 0,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: {
        left: isMobile ? 4 : 8,
        right: isMobile ? 8 : 12,
        bottom: isMobile ? 0 : 8,
      },
    },
  }

  return (
    <div className="chart-frame">
      <div className="chart-plot" style={{ height: chartHeight }}>
        {focused ? (
          <div className="chart-toolbar">
            <div className="chart-focus-bar">
              <p className="filter-meta">
                {plottedPlayers.length === 1 ? '1 person' : `${plottedPlayers.length} people`} · axis
                scaled to this set
              </p>
              <Button label="Clear people" variant="ghost" onClick={onClearPeople} />
            </div>
          </div>
        ) : null}
        <Chart key={theme} options={options} series={series} type="line" height={chartHeight} />
      </div>
      <div className="chart-legend chip-row" role="group" aria-label="Filter people on the graph">
        {allPlayers.map((player) => {
          const active = focused && focusPlayers.includes(player)
          const hovered = hoveredPlayer === player
          return (
            <button
              key={player}
              type="button"
              className={[
                'chip',
                'chip--player',
                active ? 'chip--active' : null,
                hovered ? 'chip--hover' : null,
              ]
                .filter(Boolean)
                .join(' ')}
              style={{ ['--player-color' as string]: playerColor(player, colorsByPlayer) }}
              aria-pressed={active}
              onClick={() => onTogglePlayer(player)}
              onMouseEnter={() => onHoverPlayer(player)}
              onMouseLeave={() => onHoverPlayer(null)}
            >
              {player}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function buildSeries(
  players: string[],
  sessions: PokerSession[],
  allDates: Date[],
): { name: string; data: SeriesPoint[] }[] {
  return players.map((player) => {
    const playerSessions = sessions
      .filter((session) => session.player === player)
      .sort((a, b) => a.date.getTime() - b.date.getTime())

    let cumulative = 0
    const data: SeriesPoint[] = playerSessions.map((session) => {
      cumulative += session.profit
      const dateIndex = allDates.findIndex((date) => date.getTime() === session.date.getTime())
      return { x: dateIndex, y: cumulative, dayProfit: session.profit }
    })
    return { name: player, data }
  })
}

function readChartTokens() {
  const styles = getComputedStyle(document.documentElement)
  const read = (name: string, fallback: string) => styles.getPropertyValue(name).trim() || fallback
  return {
    muted: read('--text-muted', '#9ca3af'),
    textSecondary: read('--text-secondary', '#4b5563'),
    border: read('--border', '#e5e7eb'),
    surface: read('--surface', '#ffffff'),
  }
}

function formatSignedCurrency(value: number): string {
  const sign = value > 0 ? '+' : value < 0 ? '−' : ''
  return `${sign}$${Math.abs(value).toFixed(2)}`
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}
