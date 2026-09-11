import { useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Download } from 'lucide-react'
import { domToBlob } from 'modern-screenshot'
import PageShell from '../../components/PageShell'
import SectionCard from '../../components/SectionCard'
import Button from '../../components/Button'
import { usePokerYearInReview } from '../../hooks/usePokerStats'

export function PokerYearInReviewPage() {
  const { name } = useParams<{ name: string }>()
  const contentRef = useRef<HTMLDivElement>(null)
  const [saving, setSaving] = useState(false)
  const [saveNotice, setSaveNotice] = useState<string | null>(null)

  const { data: currentUserStats, isLoading } = usePokerYearInReview(name)

  const playerName = useMemo(() => {
    return currentUserStats ? currentUserStats.player.split(' ')[0] : 'Player'
  }, [currentUserStats])

  if (isLoading) {
    return (
      <PageShell subtitle="Year in review">
        <p className="status">Loading year in review…</p>
      </PageShell>
    )
  }

  if (!currentUserStats) {
    return (
      <PageShell subtitle="Year in review">
        <SectionCard title="No sessions found">
          <p className="notice">Nothing on the sheet for {name ?? 'this player'}.</p>
        </SectionCard>
      </PageShell>
    )
  }

  const isWinner = currentUserStats.totalWinnings > 0
  const totalAmount = Math.abs(currentUserStats.totalWinnings || 0)
  const biggestSession = Math.abs(currentUserStats.highestSingleWinning || 0)
  const winRate = currentUserStats.winRate

  async function handleDownload() {
    if (!contentRef.current) return
    setSaving(true)
    setSaveNotice(null)
    try {
      if (document.fonts?.ready) {
        await document.fonts.ready
      }
      const blob = await domToBlob(contentRef.current, {
        scale: 2,
        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#fafafa',
      })
      if (!blob) {
        setSaveNotice('Couldn’t create the image.')
        return
      }
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = `${playerName}-poker-wrapped-2025.png`
      link.href = url
      link.click()
      URL.revokeObjectURL(url)
    } catch {
      setSaveNotice('Couldn’t create the image.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageShell subtitle="Year in review">
      <div className="page-stack page-stack--narrow">
        <div ref={contentRef} className="page-stack">
          <SectionCard>
            <div className="review-hero">
              <p className="review-kicker">{playerName} · 2025 Lombard poker</p>
              <p className={`review-outcome ${isWinner ? 'is-up' : 'is-down'}`}>
                {isWinner ? 'Won' : 'Lost'}
              </p>
              <p className="review-amount money">{formatCurrency(totalAmount)}</p>
              <p className="review-note">
                {isWinner ? 'Up on the year.' : 'Down on the year — still in the game.'}
              </p>
            </div>
          </SectionCard>

          <div className="review-grid">
            <SectionCard>
              <div className="review-stat">
                <p className="review-stat__value">{currentUserStats.sessions}</p>
                <p className="review-stat__label">Games played</p>
                <p className="review-stat__hint">
                  {currentUserStats.sessions >= 10 ? 'Regular at the table' : 'Getting started'}
                </p>
              </div>
            </SectionCard>
            <SectionCard>
              <div className="review-stat">
                <p className={`review-stat__value ${currentUserStats.roi >= 0 ? 'money--up' : 'money--down'}`}>
                  {formatSignedPercent(currentUserStats.roi)}
                </p>
                <p className="review-stat__label">Return on buy-in</p>
                <p className="review-stat__hint">{formatSignedCurrency(currentUserStats.avgProfit)} per game</p>
              </div>
            </SectionCard>
            <SectionCard>
              <div className="review-stat">
                <p className="review-stat__value money">{formatCurrency(biggestSession)}</p>
                <p className="review-stat__label">
                  {currentUserStats.highestSingleWinning > 0 ? 'Biggest win' : 'Biggest loss'}
                </p>
                <p className="review-stat__hint">Single session</p>
              </div>
            </SectionCard>
            <SectionCard>
              <div className="review-stat">
                <p className={`review-stat__value ${winRate >= 50 ? 'money--up' : ''}`}>
                  {winRate.toFixed(0)}%
                </p>
                <p className="review-stat__label">Win rate</p>
                <p className="review-stat__hint">Sessions finished ahead</p>
              </div>
            </SectionCard>
          </div>
        </div>

        <div className="review-actions">
          <Button
            label={saving ? 'Saving…' : 'Download recap'}
            icon={<Download size={16} />}
            onClick={() => void handleDownload()}
            disabled={saving}
          />
        </div>
        {saveNotice ? <p className="notice notice--error">{saveNotice}</p> : null}
      </div>
    </PageShell>
  )
}

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`
}

function formatSignedCurrency(value: number): string {
  const sign = value > 0 ? '+' : value < 0 ? '−' : ''
  return `${sign}$${Math.abs(value).toFixed(2)}`
}

function formatSignedPercent(value: number): string {
  const sign = value > 0 ? '+' : value < 0 ? '−' : ''
  return `${sign}${Math.abs(value).toFixed(1)}%`
}
