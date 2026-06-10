import { useState, useEffect } from 'react'
import { api } from '../api'
import { useLang } from '../context/LanguageContext'

export default function History() {
  const { t, lang } = useLang()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getHistory().then(data => {
      setHistory(data)
      setLoading(false)
    })
  }, [])

  if (loading) return <p className="text-center py-16 text-slate-400">{t.history.loading}</p>

  const locale = lang === 'ko' ? 'ko-KR' : 'en-US'

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800 mb-5">{t.history.title}</h1>

      {history.length === 0 ? (
        <p className="text-center text-slate-400 py-16 animate-slide-in">{t.history.empty}</p>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-slide-in">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                <th className="text-left  px-4 py-3 font-medium">{t.history.desc_col}</th>
                <th className="text-right px-4 py-3 font-medium">{t.history.pts_col}</th>
                <th className="text-right px-4 py-3 font-medium">{t.history.date_col}</th>
              </tr>
            </thead>
            <tbody>
              {history.map(item => (
                <tr key={item.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-700">{item.reason}</td>
                  <td className={`px-4 py-3 text-right font-bold ${item.amount > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {item.amount > 0 ? '+' : ''}{item.amount}P
                  </td>
                  <td className="px-4 py-3 text-right text-slate-400 text-xs">
                    {new Date(item.created_at + 'Z').toLocaleString(locale, {
                      month: 'short', day: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
