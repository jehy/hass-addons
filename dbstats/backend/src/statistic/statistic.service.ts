import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, IsNull, Not, Repository } from 'typeorm';
import { StatisticsShortTerm } from '../entities/homeass/2024.1.5/StatisticsShortTerm';
import { Statistics } from '../entities/homeass/2024.1.5/Statistics';
import { StatisticsMeta } from '../entities/homeass/2024.1.5/StatisticsMeta';
import type { ICountStats } from '@dbstats/shared/src/stats';

@Injectable()
export class StatisticService {
  constructor(
    @InjectRepository(StatisticsShortTerm, 'homeass')
    private repoShort: Repository<StatisticsShortTerm>,
    @InjectRepository(Statistics, 'homeass')
    private repoLong: Repository<Statistics>,
  ) {}

  async countStatsShort(): Promise<Array<ICountStats>> {
    //select m.statistic_id, count(1) from statistics s, statistics_meta m where s.metadata_id=m.id group by m.statistic_id
    const data = await this.repoShort
      .createQueryBuilder('statistics')
      .select('meta.statistic_id type, count(*) cnt')
      .innerJoin(StatisticsMeta, 'meta', 'statistics.metadata_id=meta.id')
      .groupBy('meta.statistic_id')
      .orderBy('cnt', 'DESC')
      .limit(20)
      .execute();
    return data;
  }

  async countStatsLong(): Promise<Array<ICountStats>> {
    //select m.entity_id, count(1) from statistics s, states_meta m where s.metadata_id=m.metadata_id group by m.entity_id
    const data = await this.repoLong
      .createQueryBuilder('statistics')
      .select('meta.statistic_id type, count(*) cnt')
      .innerJoin(StatisticsMeta, 'meta', 'statistics.metadata_id=meta.id')
      .groupBy('meta.statistic_id')
      .orderBy('cnt', 'DESC')
      .limit(20)
      .execute();
    return data;
  }
}
