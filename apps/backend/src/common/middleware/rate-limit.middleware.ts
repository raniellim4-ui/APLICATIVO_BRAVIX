import { Injectable, NestMiddleware, TooManyRequestsException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// Simple in-memory rate limiter (replace with Redis in production)
const requestCounts = new Map<string, Array<number>>();
const REQUESTS_PER_MINUTE = 100;
const WINDOW_MS = 60000;

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const key = req.ip;
    const now = Date.now();

    if (!requestCounts.has(key)) {
      requestCounts.set(key, []);
    }

    const timestamps = requestCounts.get(key);
    const recentRequests = timestamps.filter((time) => now - time < WINDOW_MS);

    if (recentRequests.length >= REQUESTS_PER_MINUTE) {
      throw new TooManyRequestsException(
        `Rate limit exceeded: ${REQUESTS_PER_MINUTE} requests per minute`,
      );
    }

    recentRequests.push(now);
    requestCounts.set(key, recentRequests);

    res.setHeader('X-RateLimit-Limit', REQUESTS_PER_MINUTE);
    res.setHeader('X-RateLimit-Remaining', REQUESTS_PER_MINUTE - recentRequests.length);
    res.setHeader('X-RateLimit-Reset', new Date(now + WINDOW_MS).toISOString());

    next();
  }
}
