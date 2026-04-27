import { useState } from 'react'
import type { Team } from '../types'

interface Props {
  teams: Team[]
  onSelect: (teamId: number) => void
}

export default function OnboardingScreen({ teams, onSelect }: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const selectedTeam = teams.find((t) => t.id === selectedId)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1 max-w-lg mx-auto w-full px-6 pt-16 pb-36">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
              K League 1
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-snug mb-2">
            응원하는 팀을<br />선택해주세요
          </h1>
          <p className="text-sm text-slate-500">
            선택한 팀의 경기 일정을 홈에서 바로 확인할 수 있어요
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {teams.map((team) => {
            const isSelected = selectedId === team.id
            const color = team.primaryColor ?? '#6366f1'
            return (
              <button
                key={team.id}
                onClick={() => setSelectedId(team.id)}
                style={isSelected ? { borderColor: color, backgroundColor: color + '12' } : {}}
                className={`text-left rounded-xl border transition-all duration-150 overflow-hidden ${
                  isSelected ? 'shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div style={{ backgroundColor: color }} className="h-1.5 w-full" />
                <div className="px-4 py-3.5">
                  <p
                    style={isSelected ? { color } : {}}
                    className={`text-sm font-bold leading-snug ${isSelected ? '' : 'text-slate-900'}`}
                  >
                    {team.shortName}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{team.name}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 px-6 pb-8 pt-4 bg-gradient-to-t from-slate-50 via-slate-50">
        <div className="max-w-lg mx-auto">
          <button
            disabled={!selectedId}
            onClick={() => selectedId !== null && onSelect(selectedId)}
            style={selectedTeam ? { backgroundColor: selectedTeam.primaryColor ?? undefined } : {}}
            className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all ${
              selectedId ? 'text-white shadow-sm' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {selectedTeam ? `${selectedTeam.shortName} 선택 완료` : '팀을 선택해주세요'}
          </button>
        </div>
      </div>
    </div>
  )
}
