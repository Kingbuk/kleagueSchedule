import { useEffect, useRef, useState } from 'react'

interface Props {
  months: string[] // ["2026-03", "2026-04", ...]
}

export default function ScrollMonthIndicator({ months }: Props) {
  const [label, setLabel]   = useState<string | null>(null)
  const [y, setY]           = useState(0)
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (months.length === 0) return

    const onScroll = () => {
      setVisible(true)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setVisible(false), 1200)

      // 스크롤 진행률 → 라벨 Y 위치 (스크롤바 thumb 위치와 비례)
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress  = maxScroll > 0 ? window.scrollY / maxScroll : 0
      setY(Math.max(48, Math.min(window.innerHeight - 48, progress * window.innerHeight)))

      // 뷰포트 중앙 기준으로 현재 보이는 월 계산
      const mid = window.innerHeight / 2
      let current = months[0]
      for (const month of months) {
        const el = document.querySelector<HTMLElement>(`[data-month="${month}"]`)
        if (el && el.getBoundingClientRect().top <= mid) current = month
      }
      setLabel(`${Number(current.split('-')[1])}월`)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [months])

  if (!label) return null

  return (
    <div
      className={`fixed right-3 z-50 pointer-events-none select-none transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
      style={{ top: y, transform: 'translateY(-50%)' }}
    >
      <span className="bg-slate-700/75 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
        {label}
      </span>
    </div>
  )
}
