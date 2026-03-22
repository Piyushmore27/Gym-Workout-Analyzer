import React from 'react';

const EXERCISE_ICONS = {
  Running: '🏃',
  Cycling: '🚴',
  Weightlifting: '🏋️',
  Swimming: '🏊',
};

export default function ResultsPanel({ result }) {
  const { workout, analysis } = result;
  const w = workout;

  return (
    <div className="results-wrapper">
      <h2 className="results-header">═══ Workout Analysis ═══</h2>

      <div className="results-grid">
        {/* Workout Details */}
        <div className="result-card green">
          <div className="result-section-title">― Workout Details</div>
          <div className="result-row">
            <span className="result-key">Exercise</span>
            <span className="result-val accent">{EXERCISE_ICONS[w.exerciseType]} {w.exerciseType}</span>
          </div>
          <div className="result-row">
            <span className="result-key">Duration</span>
            <span className="result-val">{w.duration} minutes</span>
          </div>
          <div className="result-row">
            <span className="result-key">Body Weight</span>
            <span className="result-val">{w.weight} kg</span>
          </div>
          <div className="result-row">
            <span className="result-key">Heart Rate</span>
            <span className="result-val">{w.heartRate} bpm</span>
          </div>
          <div className="result-row">
            <span className="result-key">Intensity</span>
            <span className="result-val">{w.intensity}</span>
          </div>
        </div>

        {/* Calorie Analysis */}
        <div className="result-card yellow">
          <div className="result-section-title">― Calorie Burn Analysis</div>
          <div className="result-row">
            <span className="result-key">Calories Burned</span>
            <span className="result-val orange">{w.caloriesBurned} kcal</span>
          </div>
          <div className="result-row">
            <span className="result-key">Calories / Minute</span>
            <span className="result-val">{w.caloriesPerMinute}</span>
          </div>
          <div className="result-row">
            <span className="result-key">Food Equivalent</span>
            <span className="result-val" style={{ fontSize: '0.8rem' }}>
              ≈ {w.foodEquivalent}
            </span>
          </div>
        </div>

        {/* Heart Rate Analysis */}
        <div className="result-card red">
          <div className="result-section-title">― Heart Rate Analysis</div>
          <div className="result-row">
            <span className="result-key">Max HR (Age 25)</span>
            <span className="result-val">195 bpm</span>
          </div>
          <div className="result-row">
            <span className="result-key">Current HR %</span>
            <span className="result-val red">{w.hrPercentage}%</span>
          </div>
          <div className="result-row">
            <span className="result-key">HR Zone</span>
            <span className="result-val red">{w.heartRateZone}</span>
          </div>
        </div>

        {/* Intensity Score */}
        <div className="result-card blue">
          <div className="result-section-title">― Workout Intensity</div>
          <div className="result-row">
            <span className="result-key">Intensity Score</span>
            <span className="result-val blue">{w.intensityScore}</span>
          </div>
          <div className="result-row">
            <span className="result-key">Workout Type</span>
            <span className="result-val blue">{w.workoutType}</span>
          </div>
        </div>

        {/* Fitness Assessment */}
        <div className="result-card green" style={{ gridColumn: 'span 2' }}>
          <div className="result-section-title">― Fitness Assessment</div>
          <div className="result-row">
            <span className="result-key">Fitness Level</span>
            <span className="result-val accent">{w.fitnessLevel}</span>
          </div>
          <div className="result-row">
            <span className="result-key">Performance Rating</span>
            <span className="result-val accent">{w.performanceRating}</span>
          </div>
        </div>
      </div>

      <div className="motivational-banner">{w.motivationalMessage}</div>
    </div>
  );
}
