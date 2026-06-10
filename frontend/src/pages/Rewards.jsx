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

    if (result?.error) {
      addToast(t.rewards.not_enough, 'error')
      return
    }
    onPointsChange()
    load()
    addToast(t.rewards.toast(reward.title, reward.points_required), 'success')
  }

  const handleDelete = async (id) => {
    await api.deleteReward(id)
    load()
  }

  if (loading) return <p className="text-center py-16 text-slate-400">{t.rewards.loading}</p>

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800 mb-5">{t.rewards.title}</h1>

      <form onSubmit={handleCreate} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6 flex flex-wrap gap-2">
        <input
          className="flex-1 min-w-44 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 transition-shadow"
          placeholder={`${t.rewards.name} *`}
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
        />
        <input
          className="flex-1 min-w-44 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 transition-shadow"
          placeholder={t.rewards.desc}
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
        />
        <input
          type="number" min={1}
          className="w-28 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 transition-shadow"
          placeholder={t.rewards.points_req}
          value={form.points_required}
          onChange={e => setForm(f => ({ ...f, points_required: Number(e.target.value) }))}
        />
        <button
          type="submit"
          className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700 active:scale-95 transition-all duration-150"
        >
          {t.rewards.add}
        </button>
      </form>

      <div className="space-y-2.5">
        {rewards.length === 0 && (
          <p className="text-center text-slate-400 py-16 animate-slide-in">{t.rewards.empty}</p>
        )}
        {rewards.map((reward, i) => {
          const canRedeem = totalPoints >= reward.points_required
          return (
            <div
              key={reward.id}
              style={{ animationDelay: `${i * 45}ms` }}
              className={`relative bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3
                hover:shadow-md hover:-translate-y-0.5 transition-all duration-200
                ${redeemingId === reward.id ? 'animate-flash-purple' : 'animate-slide-in'}
              `}
            >
              {floatingIds.has(reward.id) && (
                <span className="absolute right-16 top-0 text-violet-500 font-black text-base animate-float-up pointer-events-none select-none z-10">
                  −{reward.points_required}P
                </span>
              )}

              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-slate-800 truncate">{reward.title}</p>
                {reward.description && (
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{reward.description}</p>
                )}
              </div>

              <span className="shrink-0 text-xs font-bold text-violet-700 bg-violet-50 border border-violet-200 px-2 py-1 rounded-full">
                {reward.points_required}P
              </span>

              <button
                onClick={() => handleRedeem(reward)}
                disabled={redeemingId === reward.id}
                className={`shrink-0 text-xs px-3 py-1.5 rounded-lg font-medium transition-all active:scale-95 ${
                  canRedeem
                    ? 'bg-violet-600 text-white hover:bg-violet-700'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {t.rewards.redeem}
              </button>

              <button
                onClick={() => handleDelete(reward.id)}
                className="shrink-0 text-slate-300 hover:text-rose-400 active:scale-90 transition-all text-xl leading-none"
              >
                ×
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
