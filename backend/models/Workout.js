const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema(
  {
    exerciseType: {
      type: String,
      enum: ['Running', 'Cycling', 'Weightlifting', 'Swimming'],
      required: true,
    },
    duration: { type: Number, required: true },       // minutes
    weight: { type: Number, required: true },          // kg
    heartRate: { type: Number, required: true },       // bpm
    intensity: {
      type: String,
      enum: ['Low', 'Moderate', 'High'],
      required: true,
    },
    // Computed results stored for history/analytics
    caloriesBurned: { type: Number },
    caloriesPerMinute: { type: Number },
    foodEquivalent: { type: String },
    hrPercentage: { type: Number },
    heartRateZone: { type: String },
    intensityScore: { type: Number },
    workoutType: { type: String },
    fitnessLevel: { type: String },
    performanceRating: { type: String },
    motivationalMessage: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Workout', workoutSchema);
