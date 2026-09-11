import PageShell from '../components/PageShell'
import SectionCard from '../components/SectionCard'

export function WifiPage() {
  const qrSrc = `${import.meta.env.BASE_URL}media/wifi-qr-code.png`

  return (
    <PageShell subtitle="WiFi">
      <div className="wifi-panel">
        <SectionCard title="Scan to join" subtitle="Camera on the QR code, then connect.">
          <img className="wifi-qr" src={qrSrc} alt="WiFi QR code for NutBusters" />
          <dl>
            <div className="wifi-detail">
              <dt>Network</dt>
              <dd>NutBusters</dd>
            </div>
            <div className="wifi-detail">
              <dt>Password</dt>
              <dd className="mono">GoBears99!</dd>
            </div>
          </dl>
        </SectionCard>
      </div>
    </PageShell>
  )
}
