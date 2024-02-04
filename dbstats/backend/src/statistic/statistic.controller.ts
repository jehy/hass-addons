import { Controller, Get, Param } from '@nestjs/common';
import { StatisticService } from './statistic.service';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly statService: StatisticService) {}

  @Get('short/count')
  async countStatShort() {
    return this.statService.countStatsShort();
  }

  @Get('long/count')
  async countStatLong() {
    return this.statService.countStatsLong();
  }
}
