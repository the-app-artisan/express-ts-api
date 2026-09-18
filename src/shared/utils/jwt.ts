import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is required');
}

const AUTH_TOKEN_TTL = '7d';

export interface AuthTokenPayload {
  userId: number;
  iat: number;
}

export const generateToken = (userId: number): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: AUTH_TOKEN_TTL });
};

export const verifyToken = (token: string): AuthTokenPayload => {
  const result = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
  console.log(result);
  return result;
};
