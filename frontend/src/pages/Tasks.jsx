import { useState, useEffect } from 'react'
import { api } from '../api'
import { useLang } from '../context/LanguageContext'
import { useToast } from '../context/ToastContext'
import { getDifficulty } from '../utils/level'

const EMPTY_FORM = { title: '', description: '', points: 10, repeatable: false }

export default function Tasks({ onPointsChange }) {
  const { t, lang } = useLang()
  const { addToast } = useToast()
  const [tasks, setTasks] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(true)
  const [completingId, setCompletingId] = useState(null)
  const [floatingIds, setFloatingIds] = useState(new Set())
  const [filter, setFilter] = useState('all')

  const load = async () => {
    const data = await api.getTasks()
    setTasks(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    await api.createTask(form)
    setForm(EMPTY_FORM)
    load()
  }

  const handleComplete = async (task) => {
    setCompletingId(task.id)
    setFloatingIds(prev => new Set([...prev, task.id]))
    await Promise.all([api.completeTask(task.id), new Promise(r => setTimeout(r, 700))])
    setFloatingIds(prev => { const n = new Set(prev); n.delete(task.id); return n })
    setCompletingId(null)
    load()
    onPointsChange()
    addToast(t.tasks.toast(task.title, task.points), 'success')
  }

  const handleDelete = async (id) => {
    await api.deleteTask(id)
    load()
  }

  const activeCount = tasks.filter(t => t.status === 'pending').length
  const filtered = tasks.filter(task => {
    if (filter === 'active')    return task.status === 'pending'
    if (filter === 'completed') return task.status === 'completed'
    return true
  })

  if (loading) return <p className="text-center py-16 text-slate-500">{t.tasks.loading}</p>

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-black text-white tracking-tight">
          ⚔ {t.tasks.title}
        </h1>
        {activeCount > 0 && (
          <span className="text-xs font-bold text-violet-300 bg-violet-900/50 border border-violet-700/50 px-2.5 py-1 rounded-full">
            {t.tasks.active_count(activeCount)}
          </span>
        )}
      </div>

      {/* Add form */}
      <form onSubmit={handleCreate} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 mb-5 flex flex-wrap gap-2">
        <input
          className="flex-1 min-w-44 bg-slate-900 border border-slate-600 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-shadow"
          placeholder={`${t.tasks.name} *`}
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
        />
        <input
          className="flex-1 min-w-36 bg-slate-900 border border-slate-600 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          placeholder={t.tasks.desc}
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
        />
        <input
          type="number" min={1}
          className="w-20 bg-slate-900 border border-slate-600 text-white text-center rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          placeholder={t.tasks.points}
          value={form.points}
          onChange={e => setForm(f => ({ ...f, points: Number(e.target.value) }))}
        />
        <button
          type="button"
          onClick={() => setForm(f => ({ ...f, repeatable: !f.repeatable }))}
          title={t.tasks.repeatable}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all border ${
            form.repeatable
              ? 'bg-violet-900/50 border-violet-600 text-violet-300'
              : 'bg-slate-900 border-slate-600 text-slate-500 hover:border-slate-500 hover:text-slate-400'
          }`}
        >
          🔁 {t.tasks.repeatable}
        </button>
        <button
          type="submit"
          className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-bold active:scale-95 transition-all"
        >
          {t.tasks.add}
        </button>
      </form>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-4 bg-slate-800/40 border border-slate-700/50 rounded-lg p-1 w-fit">
        {Object.entries(t.tasks.filters).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              filter === key
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Quest list */}
      <div className="space-y-2.5">
        {filtered.length === 0 && (
          <p className="text-center text-slate-600 py-16 animate-slide-in">{t.tasks.empty}</p>
        )}
        {filtered.map((task, i) => {
          const diff = getDifficulty(task.points, lang)
          const isCompleting = completingId === task.id
          const isDone = task.status === 'completed'

          return (
            <div
              key={task.id}
              style={{ animationDelay: `${i * 40}ms` }}
              className={`relative rounded-xl border p-4 flex items-center gap-3 transition-all duration-200
                ${isCompleting
                  ? 'animate-flash-green bg-slate-800 border-emerald-500/60'
                  : isDone
                  ? 'animate-slide-in bg-slate-800/30 border-slate-700/40 opacity-50'
                  : 'animate-slide-in bg-slate-800 border-slate-700 hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/10 hover:-translate-y-0.5'
                }`}
            >
              {/* Floating XP label */}
              {floatingIds.has(task.id) && (
                <span className="absolute right-16 top-0 text-emerald-400 font-black text-base animate-float-up pointer-events-none select-none z-10"
                  style={{ textShadow: '0 0 12px #34d39980' }}>
                  +{task.points} XP
                </span>
              )}

              {/* Difficulty dot */}
              <div className="shrink-0 w-1.5 h-10 rounded-full"
                style={{
                  background: task.points < 10 ? '#475569'
                    : task.points < 25 ? '#059669'
                    : task.points < 50 ? '#ea580c'
                    : '#7c3aed'
                }}
              />

              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm truncate transition-all ${isDone ? 'line-through text-slate-600' : 'text-white'}`}>
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{task.description}</p>
                )}
              </div>

              <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${diff.cls}`}>
                {diff.label}
              </span>

              {task.repeatable ? (
                <span className="shrink-0 text-xs text-violet-400 bg-violet-900/30 border border-violet-700/50 px-1.5 py-0.5 rounded-full" title={t.tasks.repeatable}>
                  🔁
                </span>
              ) : null}

              <span className="shrink-0 text-xs font-black text-amber-400 bg-amber-900/30 border border-amber-700/50 px-2 py-1 rounded-full">
                +{task.points} XP
              </span>

              {isDone ? (
                <span className="shrink-0 text-xs text-emerald-500 font-bold">✓ {t.tasks.done}</span>
              ) : (
                <button
                  onClick={() => handleComplete(task)}
                  disabled={isCompleting}
                  className="shrink-0 text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-bold active:scale-95 transition-all disabled:opacity-50"
                >
                  {t.tasks.complete}
                </button>
              )}

              <button
                onClick={() => handleDelete(task.id)}
                className="shrink-0 text-slate-600 hover:text-rose-400 active:scale-90 transition-all text-xl leading-none"
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
