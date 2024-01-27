import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { States } from './States';

@Index('state_attributes_pkey', ['attributesId'], { unique: true })
@Index('ix_state_attributes_hash', ['hash'], {})
@Entity('state_attributes', { schema: 'public' })
export class StateAttributes {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'attributes_id' })
  attributesId: number;

  @Column('bigint', { name: 'hash', nullable: true })
  hash: string | null;

  @Column('text', { name: 'shared_attrs', nullable: true })
  sharedAttrs: string | null;

  @OneToMany(() => States, (states) => states.attributes_2)
  states: States[];
}
