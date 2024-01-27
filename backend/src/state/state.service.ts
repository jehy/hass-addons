import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, IsNull, Not, Repository } from 'typeorm';
import { States } from '../entities/homeass/2024.1.5/States';
import { StatesMeta } from '../entities/homeass/2024.1.5/StatesMeta';
import type { ICountStats } from '@dbstats/shared/src/stats';
import { StateAttributes } from '../entities/homeass/2024.1.5/StateAttributes';

const badRoundFunction = (num) => Math.round(num * 100) / 100;

@Injectable()
export class StateService {
  constructor(
    @InjectRepository(States, 'homeass')
    private statesRepository: Repository<States>,
    @InjectRepository(StateAttributes, 'homeass')
    private stateAttributesRepository: Repository<StateAttributes>,
  ) {}

  async countEventTypes(): Promise<Array<ICountStats>> {
    //select m.entity_id, count(1) from states s, states_meta m where s.metadata_id=m.metadata_id group by m.entity_id
    const data = await this.statesRepository
      .createQueryBuilder('states')
      .select('states_meta.entity_id type, count(*) cnt')
      .innerJoin(
        StatesMeta,
        'states_meta',
        'states.metadata_id=states_meta.metadata_id',
      )
      .groupBy('states_meta.entity_id')
      .orderBy('cnt', 'DESC')
      .limit(10)
      .execute();
    return data;
  }

  async countAttributesSize(): Promise<Array<ICountStats>> {
    const attributesLength = (await this.stateAttributesRepository
      .createQueryBuilder('a')
      .select('a.attributes_id, length(a.shared_attrs) len')
      .execute()) as Array<{ len: number; attributes_id: number }>;
    const attributesToEntityId = (await this.statesRepository
      .createQueryBuilder('s')
      .select('distinct s.attributes_id,m.entity_id')
      .innerJoin(StatesMeta, 'm', 's.metadata_id=m.metadata_id')
      .execute()) as Array<{ attributes_id: number; entity_id: string }>;

    const attributesToEntityIdMap = attributesToEntityId.reduce((res, item) => {
      res[item.attributes_id] = item.entity_id;
      return res;
    }, {});

    const byEntity = attributesLength.reduce((res, item) => {
      if (!res[attributesToEntityIdMap[item.attributes_id]]) {
        res[attributesToEntityIdMap[item.attributes_id]] = 0;
      }
      res[attributesToEntityIdMap[item.attributes_id]] += item.len;
      return res;
    }, {});

    const res = Object.keys(byEntity)
      .sort((a, b) => byEntity[b] - byEntity[a])
      .slice(0, 10)
      .map((key) => {
        return {
          type: key,
          cnt: badRoundFunction(byEntity[key] / 1024 / 1024),
        };
      });
    return res;
  }
}
