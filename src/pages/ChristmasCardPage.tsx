import PageShell from '../components/PageShell'
import SectionCard from '../components/SectionCard'

export function ChristmasCardPage() {
  return (
    <PageShell subtitle="Christmas card">
      <SectionCard title="2025 Christmas card">
        <p className="notice">Not ready yet. Check back later.</p>
      </SectionCard>
    </PageShell>
  )
}
