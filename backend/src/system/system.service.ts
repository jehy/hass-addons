import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { ICountStats } from '@dbstats/shared/src/stats';
import { Statistics } from '../entities/homeass/2024.1.5/Statistics';
import configProvider from '../config';

@Injectable()
export class SystemService {
  constructor(
    @InjectRepository(Statistics, 'homeass')
    private repoLong: Repository<Statistics>,
  ) {}

  async getTableRows(): Promise<Array<ICountStats>> {
    //select m.entity_id, count(1) from states s, states_meta m where s.metadata_id=m.metadata_id group by m.entity_id
    const dbType = configProvider().typeOrmConfig.type;
    if (dbType !== 'postgres') {
      throw new BadRequestException(
        `Database type ${dbType} not supported yet for this chart`,
      );
    }

    const data = await this.repoLong.manager
      .query(`SELECT relname type,n_live_tup cnt
              FROM pg_stat_user_tables
            ORDER BY n_live_tup DESC`);
    return data;
  }

  async getTableSize(): Promise<Array<ICountStats>> {
    //select m.entity_id, count(1) from states s, states_meta m where s.metadata_id=m.metadata_id group by m.entity_id
    const dbType = configProvider().typeOrmConfig.type;
    if (dbType !== 'postgres') {
      throw new BadRequestException(
        `Database type ${dbType} not supported yet for this chart`,
      );
    }
    const data = await this.repoLong.manager.query(`select
        table_name type,
            pg_total_relation_size(quote_ident(table_name))/1024/1024 cnt
        from information_schema.tables
        where table_schema = 'public'
        order by pg_total_relation_size(quote_ident(table_name)) desc;`);
    return data;
  }
}
