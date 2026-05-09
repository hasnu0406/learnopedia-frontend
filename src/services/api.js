const BASE_URL = process.env.REACT_APP_API_URL;

// Keep Render backend alive (prevents 60s cold start on free tier)
setInterval(() => {
  fetch(`${BASE_URL}/health`).catch(() => {});
}, 10 * 60 * 1000);

export async function signup(name, email, password) {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Signup failed');
  return data;
}

export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Login failed');
  return data;
}

export async function getRecommendations(interests, skills, goals) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/recommend`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ interests, skills, goals }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Failed to get recommendations');
  return data;
}