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
    <nav className="bg-slate-900 border-b border-slate-700/50 sticky top-0 z-10 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          <span className="font-black text-violet-400 text-base tracking-tight select-none"
            style={{ textShadow: '0 0 20px #7c3aed60' }}>
            ⚔ Life Quest
          </span>
          <div className="flex gap-0.5">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-violet-900/60 text-violet-300 border border-violet-700/50'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
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
          <button
            onClick={toggle}
            className="text-xs font-medium text-slate-500 hover:text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1.5 rounded-lg transition-all active:scale-95 select-none"
          >
            {lang === 'en' ? '한국어' : 'English'}
          </button>

          {/* Level badge */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full px-3 py-1.5">
            <span className="text-sm leading-none">{lv.icon}</span>
            <div>
              <div className="text-xs font-bold text-violet-300 leading-tight">
                Lv.{lv.level} <span className="font-normal text-slate-500">{lv.title}</span>
              </div>
              <div className="w-16 h-1 bg-slate-700 rounded-full overflow-hidden mt-0.5">
                <div
                  className="h-full bg-violet-500 rounded-full transition-all duration-700"
                  style={{ width: `${lv.progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* XP badge */}
          <div className={`flex items-center gap-1 bg-amber-900/40 border border-amber-700/60 text-amber-400 font-bold text-sm px-3 py-1.5 rounded-full transition-all ${bump ? 'animate-pop' : ''}`}>
            <span>★</span>
            <span>{totalPoints.toLocaleString()} XP</span>
          </div>
        </div>
      </div>
    </nav>
  )
}
