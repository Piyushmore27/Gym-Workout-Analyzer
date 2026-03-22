const Workout = require('../models/Workout');

// ── Helper: calorie calculation ──────────────────────────────────────────────
function calculateCalories(exerciseType, duration, weight, intensity) {
  const table = {
    Running:       { Low: 8,  Moderate: 11, High: 14 },
    Cycling:       { Low: 6,  Moderate: 9,  High: 12 },
    Weightlifting: { Low: 3,  Moderate: 6,  High: 9  },
    Swimming:      { Low: 7,  Moderate: 10, High: 13 },
  };
  const factor = table[exerciseType][intensity];
  return parseFloat(((factor * weight * duration) / 60).toFixed(2));
}

// ── Helper: food equivalent ──────────────────────────────────────────────────
function getFoodEquivalent(calories) {
  if (calories >= 500) {
    return { count: Math.floor(calories / 500), item: 'Burger', emoji: '🍔' };
  } else if (calories >= 300) {
    return { count: Math.floor(calories / 300), item: 'Pizza Slice', emoji: '🍕' };
  } else {
    return { count: Math.floor(calories / 250) || 1, item: 'Samosa', emoji: '🥟' };
  }
}

// ── Helper: heart rate analysis ──────────────────────────────────────────────
function analyzeHeartRate(heartRate) {
  const maxHR = 195; // age 25
  const hrPct = parseFloat(((heartRate / maxHR) * 100).toFixed(2));
  let zone;
  if (hrPct >= 85)      zone = 'Peak Zone';
  else if (hrPct >= 70) zone = 'Cardio Zone';
  else if (hrPct >= 50) zone = 'Fat Burn Zone';
  else                  zone = 'Below Training Zone';
  return { maxHR, hrPercentage: hrPct, heartRateZone: zone };
}

// ── Helper: intensity score ──────────────────────────────────────────────────
function calculateIntensityScore(duration, heartRate, intensity) {
  const multipliers = { Low: 1, Moderate: 2, High: 3 };
  const score = parseFloat(
    (duration / 10 + heartRate / 10 + multipliers[intensity] * 5).toFixed(2)
  );
  let workoutType;
  if (score > 30)       workoutType = 'Intense Workout';
  else if (score >= 20) workoutType = 'Good Workout';
  else if (score >= 10) workoutType = 'Moderate Workout';
  else                  workoutType = 'Light Workout';
  return { intensityScore: score, workoutType };
}

// ── Helper: fitness assessment ───────────────────────────────────────────────
function assessFitness(heartRate, duration, workoutType) {
  let fitnessLevel;
  if (heartRate < 120 && duration > 30)                              fitnessLevel = 'Good endurance';
  else if (heartRate > 160 && duration > 20)                         fitnessLevel = 'High intensity training';
  else if (heartRate >= 120 && heartRate <= 160 && duration > 40)    fitnessLevel = 'Steady state cardio';
  else                                                                fitnessLevel = 'General fitness';

  let performanceRating;
  if (workoutType === 'Intense Workout')   performanceRating = 'Excellent';
  else if (workoutType === 'Good Workout') performanceRating = 'Good';
  else if (workoutType === 'Moderate Workout') performanceRating = 'Average';
  else                                     performanceRating = 'Needs Improvement';

  return { fitnessLevel, performanceRating };
}

// ── Helper: motivational message ─────────────────────────────────────────────
function getMotivationalMessage(performanceRating) {
  const messages = {
    Excellent:          '⭐ Show up Daily!',
    Good:               '💪 Keep pushing your limits!',
    Average:            '🔥 You are making progress!',
    'Needs Improvement':'🚀 Every step counts. Keep going!',
  };
  return messages[performanceRating];
}

// ── Full analysis function ────────────────────────────────────────────────────
function analyzeWorkout({ exerciseType, duration, weight, heartRate, intensity }) {
  const caloriesBurned    = calculateCalories(exerciseType, duration, weight, intensity);
  const caloriesPerMinute = parseFloat((caloriesBurned / duration).toFixed(2));
  const food              = getFoodEquivalent(caloriesBurned);
  const hr                = analyzeHeartRate(heartRate);
  const score             = calculateIntensityScore(duration, heartRate, intensity);
  const fitness           = assessFitness(heartRate, duration, score.workoutType);
  const motivationalMessage = getMotivationalMessage(fitness.performanceRating);

  return {
    caloriesBurned,
    caloriesPerMinute,
    foodEquivalent: `${food.count} ${food.item} ${food.emoji}`,
    ...hr,
    ...score,
    ...fitness,
    motivationalMessage,
  };
}

// ════════════════════════════════════════════════════════════════════════════
// Controllers
// ════════════════════════════════════════════════════════════════════════════

// POST /api/workouts  — analyze + save
exports.createWorkout = async (req, res) => {
  try {
    const { exerciseType, duration, weight, heartRate, intensity } = req.body;

    // Validation
    if (!exerciseType || !duration || !weight || !heartRate || !intensity) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (!['Running', 'Cycling', 'Weightlifting', 'Swimming'].includes(exerciseType)) {
      return res.status(400).json({ message: 'Invalid exercise type.' });
    }
    if (!['Low', 'Moderate', 'High'].includes(intensity)) {
      return res.status(400).json({ message: 'Invalid intensity level.' });
    }
    if (heartRate < 60 || heartRate > 200) {
      return res.status(400).json({ message: 'Heart rate must be between 60 and 200 bpm.' });
    }

    const analysis = analyzeWorkout({ exerciseType, duration, weight, heartRate, intensity });

    const workout = await Workout.create({
      exerciseType, duration, weight, heartRate, intensity,
      ...analysis,
    });

    res.status(201).json({ workout, analysis });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/workouts  — all sessions (newest first)
exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find().sort({ createdAt: -1 });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/workouts/:id  — single session
exports.getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ message: 'Workout not found.' });
    res.json(workout);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/workouts/:id
exports.deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findByIdAndDelete(req.params.id);
    if (!workout) return res.status(404).json({ message: 'Workout not found.' });
    res.json({ message: 'Workout deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/workouts/stats/summary  — aggregate stats
exports.getStats = async (req, res) => {
  try {
    const total = await Workout.countDocuments();
    const agg = await Workout.aggregate([
      {
        $group: {
          _id: null,
          totalCalories: { $sum: '$caloriesBurned' },
          avgHR: { $avg: '$heartRate' },
          totalDuration: { $sum: '$duration' },
        },
      },
    ]);
    const byExercise = await Workout.aggregate([
      { $group: { _id: '$exerciseType', count: { $sum: 1 }, totalCalories: { $sum: '$caloriesBurned' } } },
    ]);
    res.json({
      totalSessions: total,
      totalCalories: agg[0]?.totalCalories?.toFixed(1) || 0,
      avgHeartRate: agg[0]?.avgHR?.toFixed(1) || 0,
      totalDuration: agg[0]?.totalDuration || 0,
      byExercise,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
