import type { BeforeApplicationShutdown } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService implements BeforeApplicationShutdown {
  private logger: Logger;
  constructor() {
    this.logger = new Logger(AppService.name);
  }

  beforeApplicationShutdown(signal: string) {
    this.logger.log(`Caught signal ${signal}, shutting down`);
  }

  getHello() {
    return 'Hello';
  }
}
