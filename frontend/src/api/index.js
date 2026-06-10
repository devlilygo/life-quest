const BASE = '/api'

async function request(url, options = {}) {
  const res = await fetch(BASE + url, options)
  if (res.status === 204) return null
  return res.json()
}

function json(method, data) {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }
}

export const api = {
  getTasks:     ()       => request('/tasks'),
  createTask:   (data)   => request('/tasks', json('POST', data)),
  deleteTask:   (id)     => request(`/tasks/${id}`, { method: 'DELETE' }),
  completeTask: (id)     => request(`/tasks/${id}/complete`, { method: 'PATCH' }),

  getRewards:   ()       => request('/rewards'),
  createReward: (data)   => request('/rewards', json('POST', data)),
  deleteReward: (id)     => request(`/rewards/${id}`, { method: 'DELETE' }),
  redeemReward: (id)     => request(`/rewards/${id}/redeem`, { method: 'POST' }),

  getPoints:    ()       => request('/points'),
  getHistory:   ()       => request('/points/history'),
}
