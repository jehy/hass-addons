import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Events } from './Events';

@Index('event_data_pkey', ['dataId'], { unique: true })
@Index('ix_event_data_hash', ['hash'], {})
@Entity('event_data', { schema: 'public' })
export class EventData {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'data_id' })
  dataId: number;

  @Column('bigint', { name: 'hash', nullable: true })
  hash: string | null;

  @Column('text', { name: 'shared_data', nullable: true })
  sharedData: string | null;

  @OneToMany(() => Events, (events) => events.data)
  events: Events[];
}
