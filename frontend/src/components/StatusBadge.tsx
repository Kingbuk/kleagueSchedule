import type { MatchStatus } from '../types'

interface Props {
  status: MatchStatus
}

export default function StatusBadge({ status }: Props) {
  if (status === 'LIVE')
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-md">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        LIVE
      </span>
    )
  if (status === 'FINISHED')
    return (
      <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
        종료
      </span>
    )
  return (
    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-md">
      예정
    </span>
  )
}
