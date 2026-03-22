import React, { useState } from 'react';
import WorkoutForm from './components/WorkoutForm';
import WorkoutHistory from './components/WorkoutHistory';

export default function App() {
  const [tab, setTab]       = useState('analyze');
  const [refresh, setRefresh] = useState(0);

  const handleSaved = () => {
    // Bump refresh counter so History reloads after a new workout is saved
    setRefresh((r) => r + 1);
  };

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          💪 <span>Gym</span>Track
        </div>
        <div className="nav-tabs">
          <button
            className={`nav-tab ${tab === 'analyze' ? 'active' : ''}`}
            onClick={() => setTab('analyze')}
          >
            Analyze
          </button>
          <button
            className={`nav-tab ${tab === 'history' ? 'active' : ''}`}
            onClick={() => { setTab('history'); setRefresh((r) => r + 1); }}
          >
            History
          </button>
        </div>
      </nav>

      {/* Page content */}
      <main className="main-content">
        {tab === 'analyze' && <WorkoutForm onSaved={handleSaved} />}
        {tab === 'history' && <WorkoutHistory refresh={refresh} />}
      </main>
    </div>
  );
}
