import { useState } from 'react'
import { api } from '../api'
import { useLang } from '../context/LanguageContext'

export default function Onboarding({ onComplete }) {
  const { t, lang, toggle } = useLang()
  const o = t.onboarding
  const [step, setStep] = useState(0)
  const [taskForm, setTaskForm]   = useState({ title: '', points: 10 })
  const [rewardForm, setRewardForm] = useState({ title: '', points_required: 50 })
  const [tasks,   setTasks]   = useState([])
  const [rewards, setRewards] = useState([])
  const [saving, setSaving] = useState(false)

  const addTask = (e) => {
    e?.preventDefault()
    if (!taskForm.title.trim()) return
    setTasks(p => [...p, { ...taskForm, _id: Date.now() }])
    setTaskForm({ title: '', points: 10 })
  }

  const addReward = (e) => {
    e?.preventDefault()
    if (!rewardForm.title.trim()) return
    setRewards(p => [...p, { ...rewardForm, _id: Date.now() }])
    setRewardForm({ title: '', points_required: 50 })
  }

  const finish = async () => {
    setSaving(true)
    await Promise.all([
      ...tasks.map(task     => api.createTask({ title: task.title, points: task.points })),
      ...rewards.map(reward => api.createReward({ title: reward.title, points_required: reward.points_required })),
    ])
    localStorage.setItem('lq_onboarded', '1')
    onComplete()
  }

  const skip = async () => {
    setSaving(true)
    localStorage.setItem('lq_onboarded', '1')
    onComplete()
  }

  const BG = 'fixed inset-0 bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 z-50 flex flex-col overflow-y-auto'

  /* ── STEP 0: Welcome ─────────────────────────────── */
  if (step === 0) return (
    <div className={BG + ' items-center justify-center animate-fade-in'}>
      {/* Language toggle */}
      <button
        onClick={toggle}
        className="absolute top-4 right-4 text-xs text-slate-400 hover:text-white border border-slate-600 hover:border-slate-400 px-3 py-1.5 rounded-lg transition-all"
      >
        {lang === 'en' ? '한국어' : 'English'}
      </button>

      <div className="text-center px-6 max-w-sm">
        <div
          className="text-7xl mb-8 select-none"
          style={{ filter: 'drop-shadow(0 0 28px #7c3aed)' }}
        >⚔️</div>

        <h1 className="text-5xl font-black tracking-tight mb-4 bg-gradient-to-r from-amber-400 via-violet-300 to-violet-400 bg-clip-text text-transparent">
          Life Quest
        </h1>

        <p className="text-slate-400 text-base mb-10 leading-relaxed">{o.welcome_sub}</p>

        <button
          onClick={() => setStep(1)}
          className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-4 rounded-2xl text-base transition-all active:scale-95 shadow-lg shadow-violet-900/60"
        >
          {o.welcome_btn} →
        </button>

        <button onClick={skip} className="mt-4 text-slate-600 hover:text-slate-400 text-xs transition-colors">
          {o.skip}
        </button>
      </div>
    </div>
  )

  /* ── STEP 1: Tasks ───────────────────────────────── */
  if (step === 1) return (
    <div className={BG + ' items-center justify-center'}>
      <div className="w-full max-w-md px-6 py-10 animate-slide-in">
        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex gap-2 flex-1">
            <div className="h-1 flex-1 bg-violet-500 rounded-full" />
            <div className="h-1 flex-1 bg-slate-700 rounded-full" />
          </div>
          <span className="text-slate-500 text-xs shrink-0">{lang === 'ko' ? '1 / 2 단계' : 'Step 1 of 2'}</span>
        </div>

        <div className="text-4xl mb-3">🗡️</div>
        <h2 className="text-2xl font-bold text-white mb-1">{o.step1_title}</h2>
        <p className="text-slate-400 text-sm mb-6">{o.step1_sub}</p>

        <form onSubmit={addTask} className="flex gap-2 mb-4">
          <input
            className="flex-1 bg-slate-800 border border-slate-600 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder={o.step1_placeholder}
            value={taskForm.title}
            onChange={e => setTaskForm(f => ({ ...f, title: e.target.value }))}
          />
          <input
            type="number" min={1}
            className="w-20 bg-slate-800 border border-slate-600 text-white text-center rounded-xl px-2 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            value={taskForm.points}
            onChange={e => setTaskForm(f => ({ ...f, points: Number(e.target.value) }))}
          />
          <button type="submit" className="bg-violet-600 text-white px-4 rounded-xl hover:bg-violet-500 text-sm font-medium transition-all active:scale-95">
            {o.step1_add}
          </button>
        </form>

        <div className="min-h-24 mb-8 space-y-2">
          {tasks.length === 0
            ? <p className="text-slate-600 text-sm text-center py-6">{o.step1_hint}</p>
            : tasks.map(task => (
              <div key={task._id} className="flex items-center gap-3 bg-slate-800/70 border border-slate-700 rounded-xl px-4 py-3 animate-slide-in">
                <span className="flex-1 text-sm text-white">{task.title}</span>
                <span className="text-xs text-amber-400 font-bold">+{task.points} XP</span>
                <button onClick={() => setTasks(p => p.filter(t => t._id !== task._id))} className="text-slate-600 hover:text-rose-400 transition-colors text-lg leading-none">×</button>
              </div>
            ))
          }
        </div>

        <div className="flex justify-between items-center">
          <button onClick={() => setStep(0)} className="text-slate-600 hover:text-slate-400 text-sm transition-colors">
            {o.back}
          </button>
          <button
            onClick={() => setStep(2)}
            className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 py-3 rounded-xl transition-all active:scale-95"
          >
            {o.step1_next}
          </button>
        </div>
      </div>
    </div>
  )

  /* ── STEP 2: Rewards ─────────────────────────────── */
  return (
    <div className={BG + ' items-center justify-center'}>
      <div className="w-full max-w-md px-6 py-10 animate-slide-in">
        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex gap-2 flex-1">
            <div className="h-1 flex-1 bg-violet-500 rounded-full" />
            <div className="h-1 flex-1 bg-violet-500 rounded-full" />
          </div>
          <span className="text-slate-500 text-xs shrink-0">{lang === 'ko' ? '2 / 2 단계' : 'Step 2 of 2'}</span>
        </div>

        <div className="text-4xl mb-3">🏆</div>
        <h2 className="text-2xl font-bold text-white mb-1">{o.step2_title}</h2>
        <p className="text-slate-400 text-sm mb-6">{o.step2_sub}</p>

        <form onSubmit={addReward} className="flex gap-2 mb-4">
          <input
            className="flex-1 bg-slate-800 border border-slate-600 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder={o.step2_placeholder}
            value={rewardForm.title}
            onChange={e => setRewardForm(f => ({ ...f, title: e.target.value }))}
          />
          <input
            type="number" min={1}
            className="w-20 bg-slate-800 border border-slate-600 text-white text-center rounded-xl px-2 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            value={rewardForm.points_required}
            onChange={e => setRewardForm(f => ({ ...f, points_required: Number(e.target.value) }))}
          />
          <button type="submit" className="bg-violet-600 text-white px-4 rounded-xl hover:bg-violet-500 text-sm font-medium transition-all active:scale-95">
            {o.step2_add}
          </button>
        </form>

        <div className="min-h-24 mb-8 space-y-2">
          {rewards.length === 0
            ? <p className="text-slate-600 text-sm text-center py-6">{o.step2_hint}</p>
            : rewards.map(reward => (
              <div key={reward._id} className="flex items-center gap-3 bg-slate-800/70 border border-slate-700 rounded-xl px-4 py-3 animate-slide-in">
                <span className="flex-1 text-sm text-white">{reward.title}</span>
                <span className="text-xs text-violet-400 font-bold">{reward.points_required} XP</span>
                <button onClick={() => setRewards(p => p.filter(r => r._id !== reward._id))} className="text-slate-600 hover:text-rose-400 transition-colors text-lg leading-none">×</button>
              </div>
            ))
          }
        </div>

        <div className="flex justify-between items-center">
          <button onClick={() => setStep(1)} className="text-slate-600 hover:text-slate-400 text-sm transition-colors">
            {o.back}
          </button>
          <button
            onClick={finish}
            disabled={saving}
            className="bg-gradient-to-r from-violet-600 to-amber-500 hover:from-violet-500 hover:to-amber-400 text-white font-bold px-6 py-3 rounded-xl transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-violet-900/40"
          >
            {saving ? '...' : o.finish}
          </button>
        </div>
      </div>
    </div>
  )
}
