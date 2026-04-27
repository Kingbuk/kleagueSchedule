interface Props {
  months: string[]        // ["2026-03", "2026-04", ...]
  activeMonth: string | null
  onSelect: (month: string) => void
}

function formatMonth(monthKey: string): string {
  const [, m] = monthKey.split('-')
  return `${Number(m)}월`
}

export default function MonthSelector({ months, activeMonth, onSelect }: Props) {
  if (months.length === 0) return null

  return (
    <div className="sticky z-30 bg-white border-b border-slate-200" style={{ top: 'var(--header-h, 73px)' }}>
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex gap-1 overflow-x-auto py-2 scrollbar-none">
          {months.map((m) => (
            <button
              key={m}
              onClick={() => onSelect(m)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                m === activeMonth
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {formatMonth(m)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
