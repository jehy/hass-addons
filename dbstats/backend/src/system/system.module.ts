import { Module } from '@nestjs/common';
import { SystemController } from './system.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemService } from './system.service';
import { Statistics } from '../entities/homeass/2024.1.5/Statistics';
import { StatisticsShortTerm } from '../entities/homeass/2024.1.5/StatisticsShortTerm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Statistics, StatisticsShortTerm], 'homeass'),
  ],
  controllers: [SystemController],
  providers: [SystemService],
})
export class SystemModule {}
