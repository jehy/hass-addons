import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('ix_recorder_runs_start_end', ['end', 'start'], {})
@Index('recorder_runs_pkey', ['runId'], { unique: true })
@Entity('recorder_runs', { schema: 'public' })
export class RecorderRuns {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'run_id' })
  runId: number;

  @Column({ name: 'start' })
  start: Date;

  @Column({ name: 'end', nullable: true })
  end: Date | null;

  @Column('boolean', { name: 'closed_incorrect' })
  closedIncorrect: boolean;

  @Column({ name: 'created' })
  created: Date;
}
