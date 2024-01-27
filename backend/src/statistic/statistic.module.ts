import { Module } from '@nestjs/common';
import { StatisticController } from './statistic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticService } from './statistic.service';
import { Statistics } from '../entities/homeass/2024.1.5/Statistics';
import { StatisticsShortTerm } from '../entities/homeass/2024.1.5/StatisticsShortTerm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Statistics, StatisticsShortTerm], 'homeass'),
  ],
  controllers: [StatisticController],
  providers: [StatisticService],
})
export class StatisticModule {}
