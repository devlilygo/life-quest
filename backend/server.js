const express = require('express');
const { initSchema } = require('./db/schema');

const tasksRouter = require('./routes/tasks');
const rewardsRouter = require('./routes/rewards');
const pointsRouter = require('./routes/points');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

initSchema();

app.use('/api/tasks', tasksRouter);
app.use('/api/rewards', rewardsRouter);
app.use('/api/points', pointsRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
