interface Props {
  value: number // 0-100
  label?: string
}

export default function ProgressBar({ value, label }: Props) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div className="flex items-center gap-2.5">
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Progress'}
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-border-soft"
      >
        <div
          className="h-full rounded-full bg-accent transition-all duration-300 ease-app"
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span className="w-9 shrink-0 text-right text-xs text-ink-soft">{clamped}%</span>
    </div>
  )
}
