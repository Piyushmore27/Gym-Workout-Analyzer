const express = require('express');
const router = express.Router();
const {
  createWorkout,
  getWorkouts,
  getWorkoutById,
  deleteWorkout,
  getStats,
} = require('../controllers/workoutController');

router.get('/stats/summary', getStats);
router.route('/').get(getWorkouts).post(createWorkout);
router.route('/:id').get(getWorkoutById).delete(deleteWorkout);

module.exports = router;
