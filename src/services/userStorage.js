// Decodes the JWT token to get the current user's email
function getCurrentUserEmail() {
  const token = localStorage.getItem('token');
  if (!token) return 'guest';
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub || 'guest'; // 'sub' is the email set in create_access_token
  } catch {
    return 'guest';
  }
}

// All storage keys are prefixed with the user's email
function userKey(key) {
  return `user::${getCurrentUserEmail()}::${key}`;
}

export const userStorage = {
  get: (key) => {
    try {
      return JSON.parse(localStorage.getItem(userKey(key)));
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

  // Get the email of whoever is logged in (useful to pre-fill)
  getEmail: () => getCurrentUserEmail(),
};