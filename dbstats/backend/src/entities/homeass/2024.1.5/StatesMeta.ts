import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { States } from './States';

@Index('ix_states_meta_entity_id', ['entityId'], { unique: true })
@Index('states_meta_pkey', ['metadataId'], { unique: true })
@Entity('states_meta', { schema: 'public' })
export class StatesMeta {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'metadata_id' })
  metadataId: number;

  @Column({
    name: 'entity_id',
    nullable: true,
    length: 255,
  })
  entityId: string | null;

  @OneToMany(() => States, (states) => states.metadata)
  states: States[];
}
