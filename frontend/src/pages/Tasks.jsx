import { useState, useEffect } from 'react'
import { api } from '../api'
import { useLang } from '../context/LanguageContext'
import { useToast } from '../context/ToastContext'

const EMPTY_FORM = { title: '', description: '', points: 10 }

export default function Tasks({ onPointsChange }) {
  const { t } = useLang()
  const { addToast } = useToast()
  const [tasks, setTasks] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(true)
  const [completingId, setCompletingId] = useState(null)
  const [floatingIds, setFloatingIds] = useState(new Set())

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

    await Promise.all([
      api.completeTask(task.id),
      new Promise(r => setTimeout(r, 700)),
    ])

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

  if (loading) return <p className="text-center py-16 text-slate-400">{t.tasks.loading}</p>

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800 mb-5">{t.tasks.title}</h1>

      <form onSubmit={handleCreate} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6 flex flex-wrap gap-2">
        <input
          className="flex-1 min-w-44 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 transition-shadow"
          placeholder={`${t.tasks.name} *`}
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
        />
        <input
          className="flex-1 min-w-44 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 transition-shadow"
          placeholder={t.tasks.desc}
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
        />
        <input
          type="number" min={1}
          className="w-24 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 transition-shadow"
          placeholder={t.tasks.points}
          value={form.points}
          onChange={e => setForm(f => ({ ...f, points: Number(e.target.value) }))}
        />
        <button
          type="submit"
          className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700 active:scale-95 transition-all duration-150"
        >
          {t.tasks.add}
        </button>
      </form>

      <div className="space-y-2.5">
        {tasks.length === 0 && (
          <p className="text-center text-slate-400 py-16 animate-slide-in">{t.tasks.empty}</p>
        )}
        {tasks.map((task, i) => (
          <div
            key={task.id}
            style={{ animationDelay: `${i * 45}ms` }}
            className={`relative bg-white rounded-xl border p-4 flex items-center gap-3
              hover:shadow-md hover:-translate-y-0.5 transition-all duration-200
              ${completingId === task.id ? 'animate-flash-green' : 'animate-slide-in'}
              ${task.status === 'completed' ? 'border-emerald-200 opacity-60' : 'border-slate-200'}
            `}
          >
            {floatingIds.has(task.id) && (
              <span className="absolute right-16 top-0 text-emerald-500 font-black text-base animate-float-up pointer-events-none select-none z-10">
                +{task.points}P
              </span>
            )}

            <div className="flex-1 min-w-0">
              <p className={`font-medium text-sm truncate transition-all duration-300 ${
                task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800'
              }`}>
                {task.title}
              </p>
              {task.description && (
                <p className="text-xs text-slate-400 mt-0.5 truncate">{task.description}</p>
              )}
            </div>

            <span className="shrink-0 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">
              +{task.points}P
            </span>

            {task.status === 'pending' ? (
              <button
                onClick={() => handleComplete(task)}
                disabled={completingId === task.id}
                className="shrink-0 text-xs bg-emerald-500 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-600 active:scale-95 transition-all font-medium disabled:opacity-50"
              >
                {t.tasks.complete}
              </button>
            ) : (
              <span className="shrink-0 text-xs text-emerald-600 font-medium">{t.tasks.done}</span>
            )}

            <button
              onClick={() => handleDelete(task.id)}
              className="shrink-0 text-slate-300 hover:text-rose-400 active:scale-90 transition-all text-xl leading-none"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
