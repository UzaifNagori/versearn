// Real API-based auth — MySQL via Next.js API routes

export async function login(email, password) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login fail ho gaya');

  // Token save karo
  localStorage.setItem('auth_token', data.token);
  localStorage.setItem('auth_user', JSON.stringify(data.user));
  return data.user;
}

export async function register(username, email, password, referral_code) {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password, referral_code }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Registration fail ho gaya');

  localStorage.setItem('auth_token', data.token);
  localStorage.setItem('auth_user', JSON.stringify(data.user));
  return data.user;
}

export function logout() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
}

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

export function getUser() {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('auth_token');
  if (!token) return null;
  try {
    return JSON.parse(localStorage.getItem('auth_user'));
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('auth_token');
}

// Fresh user data API se lao
export async function fetchMe() {
  const token = getToken();
  if (!token) return null;
  const res = await fetch('/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    logout();
    return null;
  }
  const data = await res.json();
  localStorage.setItem('auth_user', JSON.stringify(data.user));
  return data.user;
}

// Auth header helper — API calls mein use karo
export function authHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
