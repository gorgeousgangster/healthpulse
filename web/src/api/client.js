import axios from 'axios';

const API_BASE = 'https://healthpulse-production-b94f.up.railway.app';

const client = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

function getToken() {
  return localStorage.getItem('hp_token');
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function predictRisk(profileData) {
  const response = await client.post('/api/v1/assess-risk', profileData, {
    headers: authHeaders(),
  });
  return response.data;
}

export async function getRecommendations(profileData) {
  const response = await client.post('/api/v1/recommendations', profileData, {
    headers: authHeaders(),
  });
  return response.data;
}

export async function fetchHistory() {
  const response = await client.get('/api/v1/assessments/history', {
    headers: authHeaders(),
  });
  return response.data;
}

export async function healthCheck() {
  const response = await client.get('/health');
  return response.data;
}

export default client;
