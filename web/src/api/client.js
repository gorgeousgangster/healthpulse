import axios from 'axios';

const API_BASE = 'https://healthpulse-production-b94f.up.railway.app';

const client = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

export async function predictRisk(profileData) {
  const response = await client.post('/api/v1/assess-risk', profileData);
  return response.data;
}

export async function getRecommendations(profileData) {
  const response = await client.post('/api/v1/recommendations', profileData);
  return response.data;
}

export async function healthCheck() {
  const response = await client.get('/health');
  return response.data;
}

export default client;
