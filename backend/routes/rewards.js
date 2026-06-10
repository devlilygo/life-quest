const express = require('express');
const router = express.Router();
const {
  getAllRewards,
  getReward,
  createReward,
  updateReward,
  deleteReward,
  redeemReward,
} = require('../controllers/rewardsController');

router.get('/', getAllRewards);
router.get('/:id', getReward);
router.post('/', createReward);
router.put('/:id', updateReward);
router.delete('/:id', deleteReward);
router.post('/:id/redeem', redeemReward);

module.exports = router;
