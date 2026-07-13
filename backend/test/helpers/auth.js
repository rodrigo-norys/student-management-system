import jwt from 'jsonwebtoken';

// Espelha os ids de access_level do seed default-access-levels + demo.
export const LEVELS = {
  GENERAL_DIRECTOR: 1,
  SCHOOL_OFFICE: 2,
  FINANCE_ADMIN: 3,
  ACADEMIC_COORDINATOR: 4,
  TEACHER: 5,
  DEMO: 99,
};

export function signToken({ id, email }, options = {}) {
  return jwt.sign({ id, email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRATION) || 3600,
    ...options,
  });
}

export function cookieFor(user, options) {
  return [`access_token=${signToken(user, options)}`];
}
