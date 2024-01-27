import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, IsNull, Not, Repository } from 'typeorm';
import { Events } from '../entities/homeass/2024.1.5/Events';
import { EventTypes } from '../entities/homeass/2024.1.5/EventTypes';
import type { ICountStats } from '@dbstats/shared/src/stats';
import { EventData } from '../entities/homeass/2024.1.5/EventData';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Events, 'homeass')
    private repo: Repository<Events>,
    @InjectRepository(EventData, 'homeass')
    private repoEventData: Repository<EventData>,
  ) {}

  async countEventTypes(): Promise<Array<ICountStats>> {
    //select t.event_type_id, t.event_type, count(*) from event_types t, events e where t.event_type_id=e.event_type_id
    // group by t.event_type, t.event_type_id
    const data = await this.repo
      .createQueryBuilder('events')
      .select('types.event_type type, count(*) cnt')
      .innerJoin(
        EventTypes,
        'types',
        'types.event_type_id=events.event_type_id',
      )
      .groupBy('types.event_type')
      .orderBy('cnt', 'DESC')
      .limit(10)
      .execute();
    return data;
  }

  async countEventsByDomain(): Promise<Array<ICountStats>> {
    //select t.event_type_id, t.event_type, count(*) from event_types t, events e where t.event_type_id=e.event_type_id
    // group by t.event_type, t.event_type_id
    const data = (await this.repoEventData.find())
      .map((item) => JSON.parse(item.sharedData))
      .map((item) => item.domain)
      .filter((el) => el)
      .reduce((acc, res) => {
        if (!acc[res]) {
          acc[res] = 0;
        }
        acc[res]++;
        return acc;
      }, {});
    return Object.keys(data)
      .sort((a, b) => data[b] - data[a])
      .slice(0, 10)
      .map((key) => {
        return { type: key, cnt: data[key] };
      });
  }
}
