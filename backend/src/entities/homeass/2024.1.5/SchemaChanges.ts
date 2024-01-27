import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('schema_changes_pkey', ['changeId'], { unique: true })
@Entity('schema_changes', { schema: 'public' })
export class SchemaChanges {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'change_id' })
  changeId: number;

  @Column('integer', { name: 'schema_version', nullable: true })
  schemaVersion: number | null;

  @Column({ name: 'changed' })
  changed: Date;
}
