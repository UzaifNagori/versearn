import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'versearn_secret_key';

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

// API route se token nikalna
export function getTokenFromRequest(request) {
  const auth = request.headers.get('authorization');
  if (auth && auth.startsWith('Bearer ')) {
    return auth.slice(7);
  }
  return null;
}

// Current user return karna
export function getCurrentUser(request) {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  return verifyToken(token);
}
