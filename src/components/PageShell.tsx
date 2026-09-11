import type { ReactNode } from 'react'
import AppHeader from './AppHeader'
import MakerCredit from './MakerCredit'

type PageShellProps = {
  title?: string
  subtitle?: string
  quiet?: boolean
  home?: boolean
  actions?: ReactNode
  children: ReactNode
}

export default function PageShell({
  title = 'Lombard Party!',
  subtitle,
  quiet,
  home,
  actions,
  children,
}: PageShellProps) {
  return (
    <div className={home ? 'app-shell app-shell--home' : 'app-shell'}>
      <AppHeader title={title} subtitle={subtitle} quiet={quiet} actions={actions} />
      <main className="app-main">
        <div className="shell-inner">{children}</div>
      </main>
      {home ? (
        <footer className="app-footer">
          <MakerCredit />
        </footer>
      ) : null}
    </div>
  )
}
