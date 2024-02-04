import { join } from 'path';
import type { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { LogRequestsMiddleware } from './middleware/log-requests-middleware.service';
import { DatabaseModule } from './database.module';
import { EventModule } from './event/event.module';
import { StateModule } from './state/state.module';
import { StatisticModule } from './statistic/statistic.module';
import { SystemModule } from './system/system.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    EventModule,
    StateModule,
    StatisticModule,
    SystemModule,
    ServeStaticModule.forRoot({
      rootPath: '/var/www/html',
    }),
  ],
  exports: [DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogRequestsMiddleware).forRoutes('*');
  }
}
