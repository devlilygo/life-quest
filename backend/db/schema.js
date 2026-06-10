const db = require('./index');

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      points INTEGER NOT NULL DEFAULT 10,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME
    );

    CREATE TABLE IF NOT EXISTS rewards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      points_required INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS point_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount INTEGER NOT NULL,
      reason TEXT NOT NULL,
      reference_id INTEGER,
      reference_type TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Migrations — safe to run on existing DBs
  try { db.exec(`ALTER TABLE tasks ADD COLUMN repeatable INTEGER NOT NULL DEFAULT 0`) } catch (_) {}
  try { db.exec(`ALTER TABLE rewards ADD COLUMN repeatable INTEGER NOT NULL DEFAULT 1`) } catch (_) {}
  try { db.exec(`ALTER TABLE rewards ADD COLUMN redeemed_at DATETIME`) } catch (_) {}
}

module.exports = { initSchema };
