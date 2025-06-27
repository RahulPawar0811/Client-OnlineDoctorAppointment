// apiConfig.js
import axios from 'axios';

//const API_BASE_URL = 'http://localhost:5000';
const API_BASE_URL = 'https://server-online-doctor-appointment.vercel.app';
const imageUrl = 'https://server-online-doctor-appointment.vercel.app';
//const imageUrl = 'http://localhost:5000';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
export { imageUrl };
