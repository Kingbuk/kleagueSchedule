import type { TabKey } from '../types'

interface Tab {
  key: TabKey
  label: string
  icon: string
}

interface Props {
  activeTab: TabKey
  onChangeTab: (tab: TabKey) => void
  favoriteTeamShortName?: string
}

export default function BottomNav({ activeTab, onChangeTab, favoriteTeamShortName }: Props) {
  const tabs: Tab[] = [
    { key: 'my-team', label: favoriteTeamShortName ?? '내 팀', icon: '⭐' },
    { key: 'all',     label: '전체 경기',                      icon: '📋' },
  ]

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200">
      <div className="max-w-2xl mx-auto flex">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChangeTab(tab.key)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
              activeTab === tab.key ? 'text-indigo-600' : 'text-slate-400'
            }`}
          >
            <span className="text-xl leading-none">{tab.icon}</span>
            <span className="text-[11px] font-semibold tracking-wide">{tab.label}</span>
            {activeTab === tab.key && (
              <span className="absolute bottom-0 w-12 h-0.5 bg-indigo-600 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </nav>
  )
}
