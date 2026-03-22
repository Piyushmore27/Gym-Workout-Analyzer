import React, { useState } from 'react';
import { createWorkout } from '../utils/api';
import ResultsPanel from './ResultsPanel';

const defaultForm = {
  exerciseType: 'Running',
  duration: '',
  weight: '',
  heartRate: '',
  intensity: 'Moderate',
};

export default function WorkoutForm({ onSaved }) {
  const [form, setForm]       = useState(defaultForm);
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const payload = {
        exerciseType: form.exerciseType,
        duration:    parseInt(form.duration),
        weight:      parseInt(form.weight),
        heartRate:   parseInt(form.heartRate),
        intensity:   form.intensity,
      };
      const { data } = await createWorkout(payload);
      setResult({ workout: data.workout, analysis: data.analysis });
      onSaved && onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card">
        <h1 className="form-title">
          <span>Gym</span> Workout Analyzer
        </h1>
        <p className="form-subtitle">Enter your session details to get instant fitness analysis</p>

        {error && <div className="error-msg">⚠ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Exercise Type</label>
              <select name="exerciseType" value={form.exerciseType} onChange={handleChange}>
                <option>Running</option>
                <option>Cycling</option>
                <option>Weightlifting</option>
                <option>Swimming</option>
              </select>
            </div>

            <div className="form-group">
              <label>Intensity Level</label>
              <select name="intensity" value={form.intensity} onChange={handleChange}>
                <option>Low</option>
                <option>Moderate</option>
                <option>High</option>
              </select>
            </div>

            <div className="form-group">
              <label>Duration (minutes)</label>
              <input
                type="number" name="duration" value={form.duration}
                onChange={handleChange} placeholder="e.g. 45"
                min="1" max="300" required
              />
            </div>

            <div className="form-group">
              <label>Body Weight (kg)</label>
              <input
                type="number" name="weight" value={form.weight}
                onChange={handleChange} placeholder="e.g. 70"
                min="30" max="200" required
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Heart Rate (bpm · 60–200)</label>
              <input
                type="number" name="heartRate" value={form.heartRate}
                onChange={handleChange} placeholder="e.g. 155"
                min="60" max="200" required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? <><span className="spinner" /> Analyzing...</> : '⚡ Analyze Workout'}
          </button>
        </form>
      </div>

      {result && <ResultsPanel result={result} />}
    </div>
  );
}
