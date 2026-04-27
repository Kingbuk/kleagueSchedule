import type { Match } from '../types'
import { getWeatherDisplay } from '../lib/weather'
import StatusBadge from './StatusBadge'

interface Props {
  match: Match
  onClick: (match: Match) => void
}

export default function MatchCard({ match, onClick }: Props) {
  const isFinished = match.status === 'FINISHED'
  const isLive     = match.status === 'LIVE'
  const hasScore   = isFinished || isLive
  const weather    = getWeatherDisplay(match.weather)

  const timeStr = new Date(match.matchDate).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div
      onClick={() => onClick(match)}
      className="bg-white border border-slate-200 shadow-sm rounded-xl px-6 py-5 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-slate-300"
    >
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Round {match.round}
        </span>
        <StatusBadge status={match.status} />
      </div>

      <div className="flex items-center justify-between gap-3 mb-5">
        <span className="flex-1 text-right text-sm font-semibold text-slate-900 leading-snug">
          {match.homeTeamShortName}
        </span>
        {hasScore ? (
          <span className="text-2xl font-bold text-slate-900 tracking-tight tabular-nums px-3">
            {match.homeScore} : {match.awayScore}
          </span>
        ) : (
          <span className="text-sm font-medium text-slate-300 px-4">VS</span>
        )}
        <span className="flex-1 text-left text-sm font-semibold text-slate-900 leading-snug">
          {match.awayTeamShortName}
        </span>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span>{timeStr}</span>
          {match.stadiumName && (
            <>
              <span className="text-slate-300">·</span>
              <span>{match.stadiumName}</span>
            </>
          )}
        </div>

        {weather ? (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
            <span className="text-sm leading-none">{weather.icon}</span>
            <span>{weather.label}</span>
            <span className="font-semibold text-slate-700">{weather.temp}°C</span>
          </div>
        ) : (
          <span className="text-xs text-slate-300">날씨 정보 없음</span>
        )}
      </div>
    </div>
  )
}
