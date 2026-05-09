const BASE = 'https://learnopedia-backend.onrender.com';

export async function signup(name, email, password) {
  try {
    const res = await fetch(`${BASE}/signup`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Signup failed');
    return data;
  } catch (err) {
    if (err.message === 'Failed to fetch') {
      throw new Error('Server is waking up — please wait 30 seconds and try again.');
    }
    throw err;
  }
}

export async function login(email, password) {
  try {
    const res = await fetch(`${BASE}/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Login failed');
    return data;
  } catch (err) {
    if (err.message === 'Failed to fetch') {
      throw new Error('Server is waking up — please wait 30 seconds and try again.');
    }
    throw err;
  }
}

export async function getRecommendations(interests, skills, goals) {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${BASE}/recommend`, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ interests, skills, goals }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Failed to get recommendations');
    return data;
  } catch (err) {
    if (err.message === 'Failed to fetch') {
      throw new Error('Server is waking up — please wait 30 seconds and try again.');
    }
    throw err;
  }
}