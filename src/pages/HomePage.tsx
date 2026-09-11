import { Spade, Wifi } from 'lucide-react'
import Button from '../components/Button'
import PageShell from '../components/PageShell'

export function HomePage() {
  return (
    <PageShell home>
      <div className="home">
        <div className="home__copy">
          <p className="home__lede">Apartment hub for all things at Lombard!</p>
          <p className="home__note">
            <img
              className="home__note-mark"
              src={`${import.meta.env.BASE_URL}road.png`}
              alt=""
              width={18}
              height={18}
            />
            Lombard, Lombarded, Lombarding...
          </p>
        </div>
        <div className="home__actions">
          <Button label="Poker stats" icon={<Spade size={16} />} to="/poker/stats" />
          <Button label="WiFi" icon={<Wifi size={16} />} variant="secondary" to="/wifi" />
        </div>
      </div>
    </PageShell>
  )
}
