function getCurrentUserEmail() {
  const token = localStorage.getItem('token');
  if (!token) return 'guest';
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub || 'guest';
  } catch {
    return 'guest';
  }
}

function userKey(key) {
  return `user::${getCurrentUserEmail()}::${key}`;
}

export const userStorage = {
  get: (key) => {
    try {
      const val = localStorage.getItem(userKey(key));
      return val ? JSON.parse(val) : null;
    } catch {
      return null;
    }
  },
  set: (key, value) => {
    localStorage.setItem(userKey(key), JSON.stringify(value));
  },
  remove: (key) => {
    localStorage.removeItem(userKey(key));
  },
  getEmail: () => getCurrentUserEmail(),
};