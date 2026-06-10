import { useState, useEffect } from 'react'
import { api } from '../api'
import { useLang } from '../context/LanguageContext'
import { useToast } from '../context/ToastContext'

const EMPTY_FORM = { title: '', description: '', points_required: 50 }

export default function Rewards({ onPointsChange, totalPoints }) {
  const { t } = useLang()
  const { addToast } = useToast()
  const [rewards, setRewards] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(true)
  const [redeemingId, setRedeemingId] = useState(null)
  const [floatingIds, setFloatingIds] = useState(new Set())

  const load = async () => {
    const data = await api.getRewards()
    setRewards(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    await api.createReward(form)
    setForm(EMPTY_FORM)
    load()
  }

  const handleRedeem = async (reward) => {
    if (totalPoints < reward.points_required) {
      addToast(t.rewards.not_enough, 'error')
      return
    }
    setRedeemingId(reward.id)
    setFloatingIds(prev => new Set([...prev, reward.id]))
    const [result] = await Promise.all([
      api.redeemReward(reward.id),
      new Promise(r => setTimeout(r, 700)),
    ])
    setFloatingIds(prev => { const n = new Set(prev); n.delete(reward.id); return n })
    setRedeemingId(null)
    if (result?.error) { addToast(t.rewards.not_enough, 'error'); return }
    onPointsChange()
    load()
    addToast(t.rewards.toast(reward.title, reward.points_required), 'success')
  }

  const handleDelete = async (id) => {
    await api.deleteReward(id)
    load()
  }

  if (loading) return <p className="text-center py-16 text-slate-500">{t.rewards.loading}</p>

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-black text-white tracking-tight">🏆 {t.rewards.title}</h1>
        <span className="text-xs font-bold text-amber-400 bg-amber-900/30 border border-amber-700/50 px-2.5 py-1 rounded-full">
          ★ {totalPoints.toLocaleString()} XP
        </span>
      </div>

      {/* Add form */}
      <form onSubmit={handleCreate} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 mb-6 flex flex-wrap gap-2">
        <input
          className="flex-1 min-w-44 bg-slate-900 border border-slate-600 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          placeholder={`${t.rewards.name} *`}
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
        />
        <input
          className="flex-1 min-w-36 bg-slate-900 border border-slate-600 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          placeholder={t.rewards.desc}
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
        />
        <input
          type="number" min={1}
          className="w-24 bg-slate-900 border border-slate-600 text-white text-center rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          placeholder={t.rewards.points_req}
          value={form.points_required}
          onChange={e => setForm(f => ({ ...f, points_required: Number(e.target.value) }))}
        />
        <button
          type="submit"
          className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-bold active:scale-95 transition-all"
        >
          {t.rewards.add}
        </button>
      </form>

      {/* Reward list */}
      <div className="space-y-3">
        {rewards.length === 0 && (
          <p className="text-center text-slate-600 py-16 animate-slide-in">{t.rewards.empty}</p>
        )}
        {rewards.map((reward, i) => {
          const canRedeem = totalPoints >= reward.points_required
          const progress = Math.min(100, Math.round((totalPoints / reward.points_required) * 100))
          const isRedeeming = redeemingId === reward.id

          return (
            <div
              key={reward.id}
              style={{ animationDelay: `${i * 40}ms` }}
              className={`relative rounded-xl border p-4 transition-all duration-200
                ${isRedeeming
                  ? 'animate-flash-purple bg-slate-800 border-violet-500/60'
                  : canRedeem
                  ? 'animate-slide-in bg-slate-800 border-amber-600/40 hover:border-amber-500/60 hover:shadow-lg hover:shadow-amber-500/10 animate-glow-pulse hover:-translate-y-0.5'
                  : 'animate-slide-in bg-slate-800/60 border-slate-700/60 hover:-translate-y-0.5 hover:border-slate-600'
                }`}
            >
              {floatingIds.has(reward.id) && (
                <span className="absolute right-16 top-0 text-violet-400 font-black text-base animate-float-up pointer-events-none select-none z-10"
                  style={{ textShadow: '0 0 12px #a78bfa80' }}>
                  −{reward.points_required} XP
                </span>
              )}

              <div className="flex items-center gap-3 mb-3">
                {/* Lock / unlock icon */}
                <span className="text-lg shrink-0">{canRedeem ? '🔓' : '🔒'}</span>

                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm truncate ${canRedeem ? 'text-white' : 'text-slate-400'}`}>
                    {reward.title}
                  </p>
                  {reward.description && (
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{reward.description}</p>
                  )}
                </div>

                <span className={`shrink-0 text-sm font-black px-3 py-1 rounded-full border ${
                  canRedeem
                    ? 'text-amber-400 bg-amber-900/40 border-amber-700/60'
                    : 'text-slate-500 bg-slate-700/40 border-slate-600/50'
                }`}>
                  {reward.points_required} XP
                </span>

                <button
                  onClick={() => handleRedeem(reward)}
                  disabled={isRedeeming}
                  className={`shrink-0 text-xs px-3 py-1.5 rounded-lg font-bold transition-all active:scale-95 ${
                    canRedeem
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-900'
                      : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {t.rewards.redeem}
                </button>

                <button
                  onClick={() => handleDelete(reward.id)}
                  className="shrink-0 text-slate-600 hover:text-rose-400 active:scale-90 transition-all text-xl leading-none"
                >
                  ×
                </button>
              </div>

              {/* XP progress bar */}
              <div className="pl-8">
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>{totalPoints.toLocaleString()} / {reward.points_required} XP</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${canRedeem ? 'bg-amber-500' : 'bg-violet-600'}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
