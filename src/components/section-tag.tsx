import { cn } from '~/lib/utils'

// The section-tag register from the public homepage h2s — index cell,
// hazard-hatch chip, and uppercase mono label — as a shared component.
export function SectionTag({
  index,
  id,
  className,
  style,
  children,
}: {
  index: number | string
  id?: string
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}) {
  const label =
    typeof index === 'number' ? String(index).padStart(2, '0') : index

  return (
    <h2 id={id} className={cn('section-tag', className)} style={style}>
      <span className="section-tag-index" aria-hidden>
        {label}
      </span>
      <span className="section-tag-hatch" aria-hidden />
      <span className="section-tag-label">{children}</span>
    </h2>
  )
}
