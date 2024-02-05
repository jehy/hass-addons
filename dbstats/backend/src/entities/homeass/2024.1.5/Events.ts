import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EventData } from './EventData';
import { EventTypes } from './EventTypes';

@Index('ix_events_context_id_bin', ['contextIdBin'], {})
@Index('ix_events_data_id', ['dataId'], {})
@Index('events_pkey', ['eventId'], { unique: true })
@Index(
  'ix_events_event_type_id_time_fired_ts',
  ['eventTypeId', 'timeFiredTs'],
  {},
)
@Index('ix_events_time_fired_ts', ['timeFiredTs'], {})
@Entity('events', { schema: 'public' })
export class Events {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'event_id' })
  eventId: number;

  @Column({ name: 'event_type', nullable: true, length: 1 })
  eventType: string | null;

  @Column({ name: 'event_data', nullable: true, length: 1 })
  eventData: string | null;

  @Column({ name: 'origin', nullable: true, length: 1 })
  origin: string | null;

  @Column('smallint', { name: 'origin_idx', nullable: true })
  originIdx: number | null;

  @Column({ name: 'time_fired', nullable: true })
  timeFired: Date | null;

  @Column('double precision', {
    name: 'time_fired_ts',
    nullable: true,
    precision: 53,
  })
  timeFiredTs: number | null;

  @Column({ name: 'context_id', nullable: true, length: 1 })
  contextId: string | null;

  @Column({ name: 'context_user_id', nullable: true, length: 1 })
  contextUserId: string | null;

  @Column({ name: 'context_parent_id', nullable: true, length: 1 })
  contextParentId: string | null;

  @Column('integer', { name: 'data_id', nullable: true })
  dataId: number | null;

  @Column({ name: 'context_id_bin', nullable: true })
  contextIdBin: string | null;

  @Column({ name: 'context_user_id_bin', nullable: true })
  contextUserIdBin: string | null;

  @Column({ name: 'context_parent_id_bin', nullable: true })
  contextParentIdBin: string | null;

  @Column('integer', { name: 'event_type_id', nullable: true })
  eventTypeId: number | null;

  @ManyToOne(() => EventData, (eventData) => eventData.events)
  @JoinColumn([{ name: 'data_id', referencedColumnName: 'dataId' }])
  data: EventData;

  @ManyToOne(() => EventTypes, (eventTypes) => eventTypes.events)
  @JoinColumn([{ name: 'event_type_id', referencedColumnName: 'eventTypeId' }])
  eventType_2: EventTypes;
}
