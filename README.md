# 💪 GymTrack — MERN Stack Workout Analyzer

A full-stack **MERN** (MongoDB · Express · React · Node.js) minor project that logs gym sessions, calculates calorie burn, heart-rate zones, intensity scores, and fitness assessments — then saves everything to a MongoDB database.

---

## 🗂 Project Structure

```
gym-tracker/
├── backend/
│   ├── controllers/
│   │   └── workoutController.js   ← All business logic + analysis formulas
│   ├── models/
│   │   └── Workout.js             ← Mongoose schema
│   ├── routes/
│   │   └── workoutRoutes.js       ← REST API routes
│   ├── server.js                  ← Express + MongoDB entry point
│   ├── .env.example               ← Copy to .env and fill in
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── WorkoutForm.js     ← Input form
        │   ├── ResultsPanel.js    ← Analysis output cards
        │   └── WorkoutHistory.js  ← History tab + stats
        ├── utils/
        │   └── api.js             ← Axios helpers
        ├── App.js                 ← Root with tab navigation
        ├── index.css              ← Full design system (dark theme)
        └── index.js
```

---

## 🚀 Setup & Run

### Prerequisites
- **Node.js** v16+ and **npm**
- **MongoDB** — either local (`mongod`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

---

### 1 — Clone / copy the project

```bash
# Navigate into the project root
cd gym-tracker
```

---

### 2 — Backend setup

```bash
cd backend

# Install dependencies
npm install

# Create your .env file from the example
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/gymtracker
# For Atlas use:
# MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/gymtracker
```

Start the server:
```bash
# Development (auto-restart on changes)
npm run dev

# OR production
npm start
```

The API runs on → **http://localhost:5000**

---

### 3 — Frontend setup

Open a **second terminal**:

```bash
cd frontend

# Install dependencies
npm install

# Start React dev server
npm start
```

The app opens at → **http://localhost:3000**

> React proxies API calls to `localhost:5000` via the `"proxy"` key in `frontend/package.json`.

---

## 🔌 REST API Endpoints

| Method | Endpoint                      | Description                       |
|--------|-------------------------------|-----------------------------------|
| POST   | `/api/workouts`               | Analyze & save a workout session  |
| GET    | `/api/workouts`               | Fetch all sessions (newest first) |
| GET    | `/api/workouts/:id`           | Single session                    |
| DELETE | `/api/workouts/:id`           | Delete a session                  |
| GET    | `/api/workouts/stats/summary` | Aggregate stats                   |

### Sample POST body
```json
{
  "exerciseType": "Running",
  "duration": 45,
  "weight": 70,
  "heartRate": 155,
  "intensity": "High"
}
```

---

## 📊 Features

| Feature | Details |
|---------|---------|
| **Calorie Calculation** | Per exercise × intensity × weight × duration formula |
| **Food Equivalent** | Burger (≥500 kcal) · Pizza Slice (≥300) · Samosa (<300) |
| **Heart Rate Zones** | Peak / Cardio / Fat Burn / Below Training (Max HR = 195 for age 25) |
| **Intensity Score** | Formula: Duration/10 + HR/10 + multiplier×5 |
| **Fitness Assessment** | 4-level classification based on HR + duration |
| **Performance Rating** | Excellent / Good / Average / Needs Improvement |
| **Motivational Message** | Mapped to performance rating |
| **History Tab** | All past sessions with aggregate stats & exercise breakdown |
| **Delete Sessions** | Remove any logged workout from MongoDB |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, CSS (custom dark design system) |
| HTTP Client | Axios |
| Backend | Node.js, Express 4 |
| Database | MongoDB with Mongoose |
| Dev tool | Nodemon |

---

## 👨‍💻 Minor Project Info

- **Subject**: Web Technologies / Full Stack Development
- **Stack**: MERN (MongoDB, Express.js, React.js, Node.js)
- **Theme**: Fitness & Health Analytics
- **Design**: Dark industrial gym aesthetic with electric lime accent colour
