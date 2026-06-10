const express = require('express');
const router = express.Router();
const { getPoints, getHistory } = require('../controllers/pointsController');

router.get('/', getPoints);
router.get('/history', getHistory);

module.exports = router;
