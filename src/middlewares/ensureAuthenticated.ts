import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '../config/auth';

import AppError from '../errors/AppError';

interface TokenPayload {
  authorization: number;
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing');
  }

  const [, token] = authHeader?.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);
    const { sub, authorization } = decoded as TokenPayload;

    request.user = {
      id: sub,
      authorization,
    };

    return next();
  } catch {
    throw new AppError('invalid jwt token');
  }
}
