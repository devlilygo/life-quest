const db = require('../db/index');

function getTotalPoints() {
  const row = db.prepare('SELECT COALESCE(SUM(amount), 0) as total FROM point_history').get();
  return row.total;
}

const getAllRewards = (req, res) => {
  // is_claimed: 1 when the reward is one-time and has been redeemed at least once
  const rewards = db.prepare(`
    SELECT r.*,
      CASE
        WHEN r.repeatable = 0 AND (
          SELECT COUNT(*) FROM point_history
          WHERE reference_id = r.id AND reference_type = 'reward'
        ) > 0 THEN 1
        ELSE 0
      END AS is_claimed
    FROM rewards r
    ORDER BY r.points_required ASC
  `).all();
  res.json(rewards);
};

const getReward = (req, res) => {
  const reward = db.prepare('SELECT * FROM rewards WHERE id = ?').get(req.params.id);
  if (!reward) return res.status(404).json({ error: 'Reward not found' });
  res.json(reward);
};

const createReward = (req, res) => {
  const { title, description, points_required, repeatable = 1 } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });
  if (!points_required || points_required <= 0) {
    return res.status(400).json({ error: 'points_required must be a positive number' });
  }

  const result = db
    .prepare('INSERT INTO rewards (title, description, points_required, repeatable) VALUES (?, ?, ?, ?)')
    .run(title, description ?? null, points_required, repeatable ? 1 : 0);

  const reward = db.prepare('SELECT * FROM rewards WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(reward);
};

const updateReward = (req, res) => {
  const { title, description, points_required, repeatable } = req.body;
  const reward = db.prepare('SELECT * FROM rewards WHERE id = ?').get(req.params.id);
  if (!reward) return res.status(404).json({ error: 'Reward not found' });

  db.prepare(`
    UPDATE rewards SET
      title = COALESCE(?, title),
      description = COALESCE(?, description),
      points_required = COALESCE(?, points_required),
      repeatable = CASE WHEN ? IS NOT NULL THEN ? ELSE repeatable END
    WHERE id = ?
  `).run(title ?? null, description ?? null, points_required ?? null,
         repeatable !== undefined ? 1 : null,
         repeatable !== undefined ? (repeatable ? 1 : 0) : null,
         req.params.id);

  res.json(db.prepare('SELECT * FROM rewards WHERE id = ?').get(req.params.id));
};

const deleteReward = (req, res) => {
  const reward = db.prepare('SELECT * FROM rewards WHERE id = ?').get(req.params.id);
  if (!reward) return res.status(404).json({ error: 'Reward not found' });

  db.prepare('DELETE FROM rewards WHERE id = ?').run(req.params.id);
  res.status(204).send();
};

const redeemReward = (req, res) => {
  const reward = db.prepare('SELECT * FROM rewards WHERE id = ?').get(req.params.id);
  if (!reward) return res.status(404).json({ error: 'Reward not found' });

  const isRepeatable = reward.repeatable === 1;

  // One-time reward: block if already redeemed (check point_history as source of truth)
  if (!isRepeatable) {
    const count = db.prepare(
      `SELECT COUNT(*) AS cnt FROM point_history WHERE reference_id = ? AND reference_type = 'reward'`
    ).get(reward.id).cnt;
    if (count > 0) {
      return res.status(400).json({ error: 'Reward already claimed' });
    }
  }

  const currentPoints = getTotalPoints();
  if (currentPoints < reward.points_required) {
    return res.status(400).json({
      error: 'Not enough points',
      current_points: currentPoints,
      required: reward.points_required,
    });
  }

  db.transaction(() => {
    db.prepare(`
      INSERT INTO point_history (amount, reason, reference_id, reference_type)
      VALUES (?, ?, ?, 'reward')
    `).run(-reward.points_required, `Reward redeemed: ${reward.title}`, reward.id);
  })();

  // Return updated reward with is_claimed flag
  const updated = db.prepare(`
    SELECT r.*,
      CASE
        WHEN r.repeatable = 0 AND (
          SELECT COUNT(*) FROM point_history
          WHERE reference_id = r.id AND reference_type = 'reward'
        ) > 0 THEN 1
        ELSE 0
      END AS is_claimed
    FROM rewards r WHERE r.id = ?
  `).get(reward.id);

  res.json({
    reward: updated,
    points_spent: reward.points_required,
    total_points: getTotalPoints(),
  });
};

module.exports = { getAllRewards, getReward, createReward, updateReward, deleteReward, redeemReward };
