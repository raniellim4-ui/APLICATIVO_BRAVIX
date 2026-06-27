import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;

      const statusEmoji =
        statusCode >= 500 ? '❌' : statusCode >= 400 ? '⚠️' : '✅';

      this.logger.log(
        `${statusEmoji} ${method.toUpperCase()} ${originalUrl} ${statusCode} - ${duration}ms - IP: ${ip}`,
      );
    });

    next();
  }
}
