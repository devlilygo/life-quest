import { useState, useEffect } from 'react'
import { api } from '../api'
import { useLang } from '../context/LanguageContext'

export default function History() {
  const { t, lang } = useLang()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getHistory().then(data => { setHistory(data); setLoading(false) })
  }, [])

  if (loading) return <p className="text-center py-16 text-slate-500">{t.history.loading}</p>

  const locale = lang === 'ko' ? 'ko-KR' : 'en-US'
  const totalEarned = history.filter(h => h.amount > 0).reduce((s, h) => s + h.amount, 0)
  const totalSpent  = history.filter(h => h.amount < 0).reduce((s, h) => s + h.amount, 0)

  return (
    <div>
      {/* Header */}
      <h1 className="text-xl font-black text-white tracking-tight mb-5">📜 {t.history.title}</h1>

      {/* Summary cards */}
      {history.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-6 animate-slide-in">
          <div className="bg-emerald-900/20 border border-emerald-700/40 rounded-xl p-4">
            <p className="text-xs text-emerald-600 font-medium mb-1">{t.history.earned}</p>
            <p className="text-2xl font-black text-emerald-400">+{totalEarned.toLocaleString()}</p>
            <p className="text-xs text-emerald-700 mt-0.5">XP</p>
          </div>
          <div className="bg-rose-900/20 border border-rose-700/40 rounded-xl p-4">
            <p className="text-xs text-rose-600 font-medium mb-1">{t.history.spent}</p>
            <p className="text-2xl font-black text-rose-400">{totalSpent.toLocaleString()}</p>
            <p className="text-xs text-rose-700 mt-0.5">XP</p>
          </div>
        </div>
      )}

      {/* Log entries */}
      {history.length === 0 ? (
        <p className="text-center text-slate-600 py-16 animate-slide-in">{t.history.empty}</p>
      ) : (
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden animate-slide-in">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-2.5 bg-slate-800 border-b border-slate-700 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>{t.history.desc_col}</span>
            <span className="text-right">{t.history.pts_col}</span>
            <span className="text-right">{t.history.date_col}</span>
          </div>

          {history.map((item, i) => {
            const isEarned = item.amount > 0
            return (
              <div
                key={item.id}
                style={{ animationDelay: `${i * 25}ms` }}
                className="grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-3 border-b border-slate-700/50 last:border-0 hover:bg-slate-700/30 transition-colors items-center animate-slide-in"
              >
                {/* Left colored bar + text */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-1 h-8 rounded-full shrink-0 ${isEarned ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <div className="min-w-0">
                    <p className="text-sm text-slate-300 truncate">{item.reason}</p>
                  </div>
                </div>

                {/* XP amount */}
                <span className={`text-sm font-black tabular-nums ${isEarned ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isEarned ? '+' : ''}{item.amount} XP
                </span>

                {/* Date */}
                <span className="text-xs text-slate-600 text-right whitespace-nowrap">
                  {new Date(item.created_at + 'Z').toLocaleString(locale, {
                    month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
