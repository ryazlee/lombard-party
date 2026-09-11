import type { ReactNode } from 'react'

type SectionCardProps = {
  title?: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
  noPadding?: boolean
}

export default function SectionCard({
  title,
  subtitle,
  actions,
  children,
  className,
  noPadding,
}: SectionCardProps) {
  const showHeader = title || subtitle || actions

  return (
    <section className={['surface-card', className].filter(Boolean).join(' ')}>
      {showHeader ? (
        <div className="surface-card__header">
          <div className="surface-card__heading">
            {title ? <p className="section-label">{title}</p> : null}
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
          {actions ? <div className="surface-card__actions">{actions}</div> : null}
        </div>
      ) : null}
      <div className={noPadding ? 'surface-card__fill' : 'surface-card__body'}>{children}</div>
    </section>
  )
}
