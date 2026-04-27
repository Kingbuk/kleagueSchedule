import { useState, useMemo, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchMatches, fetchTeams } from './api'
import type { Match, Team, TabKey } from './types'
import { formatSectionDate } from './lib/date'
import MatchCard from './components/MatchCard'
import MatchModal from './components/MatchModal'
import OnboardingScreen from './components/OnboardingScreen'
import BottomNav from './components/BottomNav'

export default function App() {
  const [favoriteTeamId, setFavoriteTeamId] = useState<string | null>(
    () => localStorage.getItem('favoriteTeamId')
  )
  const [activeTab, setActiveTab]         = useState<TabKey>('my-team')
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)

  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  })

  const { data: teams = [], isLoading: teamsLoading } = useQuery<Team[]>({
    queryKey: ['teams'],
    queryFn: fetchTeams,
  })

  const queryTeamId = activeTab === 'my-team' ? favoriteTeamId : null

  const { data: matches = [], isLoading, isError } = useQuery<Match[]>({
    queryKey: ['matches', queryTeamId],
    queryFn: () => fetchMatches(queryTeamId ? { teamId: queryTeamId } : {}),
    enabled: !!favoriteTeamId,
  })

  const favoriteTeam = teams.find((t) => String(t.id) === String(favoriteTeamId))
  const headerRef    = useRef<HTMLElement | null>(null)

  const groupedMatches = useMemo<[string, Match[]][]>(() => {
    const groups: Record<string, Match[]> = {}
    matches.forEach((match) => {
      const d = new Date(match.matchDate)
      const key = [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, '0'),
        String(d.getDate()).padStart(2, '0'),
      ].join('-')
      if (!groups[key]) groups[key] = []
      groups[key].push(match)
    })
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
  }, [matches])

  const firstUpcomingKey = useMemo<string | null>(() => {
    const now = new Date()
    return (
      groupedMatches.find(([, dayMatches]) =>
        dayMatches.some(
          (m) => m.status === 'LIVE' ||
                 (m.status === 'SCHEDULED' && new Date(m.matchDate) > now)
        )
      )?.[0] ?? null
    )
  }, [groupedMatches])

  // data-upcoming 속성으로 대상 섹션을 찾아 즉시 스크롤
  // - ref 콜백 타이밍 문제 없음 (DOM에서 직접 조회)
  // - rAF cleanup 취소 문제 없음
  useEffect(() => {
    if (!firstUpcomingKey) return
    const el = document.querySelector<HTMLElement>('[data-upcoming="true"]')
    if (!el) return
    const headerH = headerRef.current?.offsetHeight ?? 80
    const top = el.getBoundingClientRect().top + window.scrollY - headerH
    window.scrollTo(0, Math.max(0, top))
  }, [firstUpcomingKey, activeTab])

  const handleSelectFavoriteTeam = (teamId: number) => {
    const id = String(teamId)
    localStorage.setItem('favoriteTeamId', id)
    setFavoriteTeamId(id)
    setActiveTab('my-team')
  }

  const handleChangeTeam = () => {
    localStorage.removeItem('favoriteTeamId')
    setFavoriteTeamId(null)
  }

  if (!favoriteTeamId && teamsLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-400">불러오는 중…</p>
      </div>
    )
  }

  if (!favoriteTeamId) {
    return <OnboardingScreen teams={teams} onSelect={handleSelectFavoriteTeam} />
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 헤더 */}
      <header ref={headerRef} className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  {activeTab === 'my-team' && favoriteTeam
                    ? favoriteTeam.shortName
                    : 'K리그 직관 가이드'}
                </h1>
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                  K League 1
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{today}</p>
            </div>
            {activeTab === 'my-team' && (
              <button
                onClick={handleChangeTeam}
                className="text-xs text-slate-400 hover:text-slate-600 border border-slate-200 rounded-lg px-3 py-1.5 transition-colors"
              >
                팀 변경
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 경기 목록 */}
      <main className="max-w-2xl mx-auto px-6 pt-4 pb-28">
        {isLoading && (
          <div className="text-center py-24 text-sm text-slate-500">불러오는 중…</div>
        )}
        {isError && (
          <div className="text-center py-24 space-y-1">
            <p className="text-sm text-slate-500">데이터를 불러오지 못했습니다</p>
            <p className="text-xs text-slate-400">백엔드 서버가 실행 중인지 확인해주세요</p>
          </div>
        )}
        {!isLoading && !isError && groupedMatches.length === 0 && (
          <div className="text-center py-24 text-sm text-slate-500">경기 일정이 없습니다</div>
        )}

        <div className="space-y-8">
          {groupedMatches.map(([dateKey, dayMatches]) => {
            const isPast          = !!firstUpcomingKey && dateKey < firstUpcomingKey
            const isFirstUpcoming = dateKey === firstUpcomingKey

            return (
              <section
                key={dateKey}
                data-upcoming={isFirstUpcoming ? 'true' : undefined}
                className={isPast ? 'opacity-50' : ''}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 shrink-0">
                    {formatSectionDate(dateKey)}
                  </span>
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs text-slate-400 shrink-0">{dayMatches.length}경기</span>
                </div>
                <div className="flex flex-col gap-2.5">
                  {dayMatches.map((match) => (
                    <MatchCard key={match.id} match={match} onClick={setSelectedMatch} />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </main>

      <BottomNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        favoriteTeamShortName={favoriteTeam?.shortName}
      />

      <MatchModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />
    </div>
  )
}
