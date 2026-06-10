import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import { getLevel } from '../utils/level'

export default function Navbar({ totalPoints }) {
  const { t, lang, toggle } = useLang()
  const prevPoints = useRef(totalPoints)
  const [bump, setBump] = useState(false)

  useEffect(() => {
    if (prevPoints.current !== totalPoints) {
      prevPoints.current = totalPoints
      setBump(true)
      setTimeout(() => setBump(false), 220)
    }
  }, [totalPoints])

  const lv = getLevel(totalPoints, lang)

  const links = [
    { to: '/tasks',   label: t.nav.tasks },
    { to: '/rewards', label: t.nav.rewards },
    { to: '/history', label: t.nav.history },
  ]

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          <span className="font-bold text-violet-700 text-base tracking-tight select-none">⚔ Life Quest</span>
          <div className="flex gap-1">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-violet-100 text-violet-700'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <button
            onClick={toggle}
            className="text-xs font-medium text-slate-500 hover:text-violet-600 bg-slate-100 hover:bg-violet-50 border border-slate-200 hover:border-violet-200 px-2.5 py-1.5 rounded-lg transition-all duration-150 active:scale-95 select-none"
          >
            {lang === 'en' ? '한국어' : 'English'}
          </button>

          {/* Level badge */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5">
            <span className="text-sm leading-none">{lv.icon}</span>
            <div>
              <div className="text-xs font-bold text-violet-700 leading-tight">
                Lv.{lv.level} <span className="font-normal text-slate-500">{lv.title}</span>
              </div>
              <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden mt-0.5">
                <div
                  className="h-full bg-violet-500 rounded-full transition-all duration-700"
                  style={{ width: `${lv.progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* XP badge */}
          <div className={`flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 font-bold text-sm px-3 py-1.5 rounded-full transition-all ${bump ? 'animate-pop' : ''}`}>
            <span>★</span>
            <span>{totalPoints.toLocaleString()} XP</span>
          </div>
        </div>
      </div>
    </nav>
  )
}
