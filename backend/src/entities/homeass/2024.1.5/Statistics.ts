import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StatisticsMeta } from './StatisticsMeta';

@Index('statistics_pkey', ['id'], { unique: true })
@Index('ix_statistics_statistic_id_start_ts', ['metadataId', 'startTs'], {
  unique: true,
})
@Index('ix_statistics_start_ts', ['startTs'], {})
@Entity('statistics', { schema: 'public' })
export class Statistics {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column({ name: 'created', nullable: true })
  created: Date | null;

  @Column('double precision', {
    name: 'created_ts',
    nullable: true,
    precision: 53,
  })
  createdTs: number | null;

  @Column('integer', { name: 'metadata_id', nullable: true })
  metadataId: number | null;

  @Column({ name: 'start', nullable: true })
  start: Date | null;

  @Column('double precision', {
    name: 'start_ts',
    nullable: true,
    precision: 53,
  })
  startTs: number | null;

  @Column('double precision', { name: 'mean', nullable: true, precision: 53 })
  mean: number | null;

  @Column('double precision', { name: 'min', nullable: true, precision: 53 })
  min: number | null;

  @Column('double precision', { name: 'max', nullable: true, precision: 53 })
  max: number | null;

  @Column({ name: 'last_reset', nullable: true })
  lastReset: Date | null;

  @Column('double precision', {
    name: 'last_reset_ts',
    nullable: true,
    precision: 53,
  })
  lastResetTs: number | null;

  @Column('double precision', { name: 'state', nullable: true, precision: 53 })
  state: number | null;

  @Column('double precision', { name: 'sum', nullable: true, precision: 53 })
  sum: number | null;

  @ManyToOne(
    () => StatisticsMeta,
    (statisticsMeta) => statisticsMeta.statistics,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn([{ name: 'metadata_id', referencedColumnName: 'id' }])
  metadata: StatisticsMeta;
}
