import { TypeOrmModule } from '@nestjs/typeorm';
import config from './config';
import { TypeOrmLoggerContainer } from './typeOrmLogger';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...config().typeOrmConfig,
      synchronize: false,
      entities: [__dirname + '/entities/homeass/2024.1.5/*{.ts,.js}'],
      logger: TypeOrmLoggerContainer.ForConnection(
        'homeass',
        config().db.logging || ['error'],
      ),
      name: 'homeass',
      maxQueryExecutionTime: 1000,
      keepConnectionAlive: true,
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
