import type { NestMiddleware } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';

import type { Request, Response, NextFunction } from 'express';

type NestRequest = Request & { user?: { login?: string } };

@Injectable()
export class LogRequestsMiddleware implements NestMiddleware {
  private logger = new Logger(LogRequestsMiddleware.name);

  use(request: NestRequest, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl: url } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('close', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      const userLogin = request?.user?.login || 'Anonymous';

      this.logger.log(
        `${userLogin} ${method} ${url} ${statusCode} ${
          contentLength || 0
        } - ${userAgent} ${ip}`,
      );
    });

    next();
  }
}
