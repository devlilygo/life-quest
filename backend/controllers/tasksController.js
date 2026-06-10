const db = require('../db/index');

function getTotalPoints() {
  const row = db.prepare('SELECT COALESCE(SUM(amount), 0) as total FROM point_history').get();
  return row.total;
}

const getAllTasks = (req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all();
  res.json(tasks);
};

const getTask = (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
};

const createTask = (req, res) => {
  const { title, description, points = 10 } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });

  const result = db
    .prepare('INSERT INTO tasks (title, description, points) VALUES (?, ?, ?)')
    .run(title, description ?? null, points);

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(task);
};

const updateTask = (req, res) => {
  const { title, description, points } = req.body;
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  db.prepare(`
    UPDATE tasks SET
      title = COALESCE(?, title),
      description = COALESCE(?, description),
      points = COALESCE(?, points)
    WHERE id = ?
  `).run(title ?? null, description ?? null, points ?? null, req.params.id);

  res.json(db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id));
};

const deleteTask = (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
  res.status(204).send();
};

const completeTask = (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  if (task.status === 'completed') {
    return res.status(400).json({ error: 'Task already completed' });
  }

  const complete = db.transaction(() => {
    db.prepare(`
      UPDATE tasks SET status = 'completed', completed_at = CURRENT_TIMESTAMP WHERE id = ?
    `).run(task.id);

    db.prepare(`
      INSERT INTO point_history (amount, reason, reference_id, reference_type)
      VALUES (?, ?, ?, 'task')
    `).run(task.points, `Task completed: ${task.title}`, task.id)
  });

  complete();

  const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(task.id);
  res.json({ task: updated, points_earned: task.points, total_points: getTotalPoints() });
};

module.exports = { getAllTasks, getTask, createTask, updateTask, deleteTask, completeTask };
