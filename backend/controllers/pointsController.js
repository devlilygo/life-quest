const db = require('../db/index');

const getPoints = (req, res) => {
  const row = db.prepare('SELECT COALESCE(SUM(amount), 0) as total FROM point_history').get();
  res.json({ total_points: row.total });
};

const getHistory = (req, res) => {
  const history = db
    .prepare('SELECT * FROM point_history ORDER BY created_at DESC')
    .all();
  res.json(history);
};

module.exports = { getPoints, getHistory };
