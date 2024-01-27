import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('statistics_runs_pkey', ['runId'], { unique: true })
@Index('ix_statistics_runs_start', ['start'], {})
@Entity('statistics_runs', { schema: 'public' })
export class StatisticsRuns {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'run_id' })
  runId: number;

  @Column({ name: 'start' })
  start: Date;
}
