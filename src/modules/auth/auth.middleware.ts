import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './auth.types';
import { UnauthorizedError } from '../../shared/errors/custom-errors';
import { verifyToken } from '../../shared/utils/jwt';
import authService from './auth.service';

const getBearerToken = (authorizationHeader: string | undefined) => {
  if (!authorizationHeader) {
    return;
  }

  const [scheme, token] = authorizationHeader.trim().split(/\s+/);

  if (scheme !== 'Bearer' || !token) {
    return;
  }

  return token;
};

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = getBearerToken(req.headers.authorization);
  if (!token) {
    throw new UnauthorizedError('Access denied: No token provided');
  }

  try {
    const { userId, iat } = verifyToken(token);

    const user = await authService.getUser(userId, {
      id: true,
      name: true,
      email: true,
      lastLogoutAt: true,
    });
    if (!user) {
      throw new UnauthorizedError('Invalid token');
    }

    if (
      user.lastLogoutAt &&
      iat < Math.round(user.lastLogoutAt.getTime() / 1000)
    ) {
      throw new UnauthorizedError('Invalid token');
    }

    req.user = { id: user.id, name: user.name, email: user.email };
    next();
  } catch (error) {
    throw new UnauthorizedError('Invalid token');
  }
};
