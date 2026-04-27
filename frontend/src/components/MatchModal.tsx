import type { Match } from '../types'
import { getWeatherDisplay } from '../lib/weather'
import StatusBadge from './StatusBadge'

interface Props {
  match: Match | null
  onClose: () => void
}

export default function MatchModal({ match, onClose }: Props) {
  if (!match) return null

  const isFinished  = match.status === 'FINISHED'
  const isLive      = match.status === 'LIVE'
  const hasScore    = isFinished || isLive
  const statusLabel = isLive ? '진행중' : isFinished ? '종료' : '예정'
  const weather     = getWeatherDisplay(match.weather)

  const infoRows = [
    {
      label: '일시',
      value: new Date(match.matchDate).toLocaleString('ko-KR', {
        year: 'numeric', month: 'long', day: 'numeric',
        weekday: 'short', hour: '2-digit', minute: '2-digit',
      }),
    },
    match.stadiumName ? { label: '경기장', value: match.stadiumName } : null,
    match.stadiumCity ? { label: '도시',   value: match.stadiumCity } : null,
    { label: '상태', value: statusLabel },
  ].filter((row): row is { label: string; value: string } => row !== null)

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm sm:max-w-md shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Round {match.round}
            </span>
            <StatusBadge status={match.status} />
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors text-base"
          >
            ✕
          </button>
        </div>

        {/* 스코어 */}
        <div className="px-6 py-7 text-center bg-slate-50 border-b border-slate-100">
          <div className="flex items-center justify-center gap-4">
            <span className="text-base font-semibold text-slate-900">{match.homeTeamShortName}</span>
            {hasScore ? (
              <span className="text-4xl font-bold text-slate-900 tracking-tight tabular-nums">
                {match.homeScore} : {match.awayScore}
              </span>
            ) : (
              <span className="text-3xl font-light text-slate-300">VS</span>
            )}
            <span className="text-base font-semibold text-slate-900">{match.awayTeamShortName}</span>
          </div>
        </div>

        {/* 날씨 */}
        <div className="px-6 py-4 border-b border-slate-100">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            경기 시간 날씨
          </p>
          {weather ? (
            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl leading-none">{weather.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{weather.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">습도 {weather.humidity}%</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 tabular-nums">{weather.temp}°C</p>
            </div>
          ) : (
            <p className="text-sm text-slate-400">조회 가능한 날씨 정보가 없습니다</p>
          )}
        </div>

        {/* 상세 정보 */}
        <div className="px-6 py-2">
          {infoRows.map(({ label, value }) => (
            <div
              key={label}
              className="flex justify-between items-center py-3.5 border-b border-slate-100 last:border-0"
            >
              <span className="text-sm text-slate-500">{label}</span>
              <span className="text-sm font-medium text-slate-900 text-right">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
