import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

export const createWorkout  = (data)     => API.post('/workouts', data);
export const getWorkouts    = ()         => API.get('/workouts');
export const deleteWorkout  = (id)       => API.delete(`/workouts/${id}`);
export const getStats       = ()         => API.get('/workouts/stats/summary');
