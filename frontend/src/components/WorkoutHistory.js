import React, { useEffect, useState, useCallback } from 'react';
import { getWorkouts, deleteWorkout, getStats } from '../utils/api';

const ICONS = {
  Running: '🏃',
  Cycling: '🚴',
  Weightlifting: '🏋️',
  Swimming: '🏊',
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function WorkoutHistory({ refresh }) {
  const [workouts, setWorkouts] = useState([]);
  const [stats, setStats]       = useState(null);
  const [loading, setLoading]   = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [wRes, sRes] = await Promise.all([getWorkouts(), getStats()]);
      setWorkouts(wRes.data);
      setStats(sRes.data);
    } catch {
      /* server might not be running */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load, refresh]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this workout session?')) return;
    try {
      await deleteWorkout(id);
      load();
    } catch {}
  };

  if (loading) {
    return <div className="loading-overlay">Loading workout history...</div>;
  }

  return (
    <div>
      <div className="history-header">
        <h2 className="history-title">Workout History</h2>
        <button className="btn btn-primary" onClick={load}>↻ Refresh</button>
      </div>

      {/* Stats row */}
      {stats && (
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-num">{stats.totalSessions}</div>
            <div className="stat-label">Total Sessions</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{stats.totalCalories}</div>
            <div className="stat-label">Total kcal Burned</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{stats.avgHeartRate}</div>
            <div className="stat-label">Avg Heart Rate</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{stats.totalDuration}</div>
            <div className="stat-label">Total Minutes</div>
          </div>
        </div>
      )}

      {/* Exercise breakdown */}
      {stats?.byExercise?.length > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="result-section-title">Exercise Breakdown</div>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            {stats.byExercise.map((ex) => (
              <div key={ex._id} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem' }}>{ICONS[ex._id]}</div>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '1.1rem' }}>{ex._id}</div>
                <div style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>{ex.count}×</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{ex.totalCalories.toFixed(0)} kcal</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Session list */}
      {workouts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏋️</div>
          <p>No workouts logged yet. Start your first session!</p>
        </div>
      ) : (
        <div className="workout-list">
          {workouts.map((w) => (
            <div className="workout-item" key={w._id}>
              <div className="workout-item-left">
                <div className="exercise-icon">{ICONS[w.exerciseType]}</div>
                <div>
                  <div className="workout-item-name">{w.exerciseType}</div>
                  <div className="workout-item-meta">
                    {formatDate(w.createdAt)} &nbsp;·&nbsp;
                    <span className={`badge badge-${w.intensity.toLowerCase()}`}>{w.intensity}</span>
                  </div>
                </div>
              </div>
              <div className="workout-item-right">
                <div className="workout-stat">
                  <span className="workout-stat-val">{w.duration}</span>
                  <span className="workout-stat-label">min</span>
                </div>
                <div className="workout-stat">
                  <span className="workout-stat-val">{w.caloriesBurned}</span>
                  <span className="workout-stat-label">kcal</span>
                </div>
                <div className="workout-stat">
                  <span className="workout-stat-val">{w.heartRate}</span>
                  <span className="workout-stat-label">bpm</span>
                </div>
                <div className="workout-stat" style={{ minWidth: 90 }}>
                  <span className="workout-stat-val" style={{ fontSize: '0.8rem', color: 'var(--text)' }}>
                    {w.workoutType}
                  </span>
                  <span className="workout-stat-label">{w.performanceRating}</span>
                </div>
                <button className="btn btn-danger" onClick={() => handleDelete(w._id)}>✕ Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
