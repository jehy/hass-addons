import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StateAttributes } from './StateAttributes';
import { StatesMeta } from './StatesMeta';

@Index('ix_states_attributes_id', ['attributesId'], {})
@Index('ix_states_context_id_bin', ['contextIdBin'], {})
@Index('ix_states_last_updated_ts', ['lastUpdatedTs'], {})
@Index(
  'ix_states_metadata_id_last_updated_ts',
  ['lastUpdatedTs', 'metadataId'],
  {},
)
@Index('ix_states_old_state_id', ['oldStateId'], {})
@Index('states_pkey', ['stateId'], { unique: true })
@Entity('states', { schema: 'public' })
export class States {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'state_id' })
  stateId: number;

  @Column({ name: 'entity_id', nullable: true, length: 1 })
  entityId: string | null;

  @Column({ name: 'state', nullable: true, length: 255 })
  state: string | null;

  @Column({ name: 'attributes', nullable: true, length: 1 })
  attributes: string | null;

  @Column('smallint', { name: 'event_id', nullable: true })
  eventId: number | null;

  @Column({ name: 'last_changed', nullable: true })
  lastChanged: Date | null;

  @Column('double precision', {
    name: 'last_changed_ts',
    nullable: true,
    precision: 53,
  })
  lastChangedTs: number | null;

  @Column({ name: 'last_updated', nullable: true })
  lastUpdated: Date | null;

  @Column('double precision', {
    name: 'last_updated_ts',
    nullable: true,
    precision: 53,
  })
  lastUpdatedTs: number | null;

  @Column('integer', { name: 'old_state_id', nullable: true })
  oldStateId: number | null;

  @Column('integer', { name: 'attributes_id', nullable: true })
  attributesId: number | null;

  @Column({ name: 'context_id', nullable: true, length: 1 })
  contextId: string | null;

  @Column({ name: 'context_user_id', nullable: true, length: 1 })
  contextUserId: string | null;

  @Column({ name: 'context_parent_id', nullable: true, length: 1 })
  contextParentId: string | null;

  @Column('smallint', { name: 'origin_idx', nullable: true })
  originIdx: number | null;

  @Column({ name: 'context_id_bin', nullable: true })
  contextIdBin: string | null;

  @Column({ name: 'context_user_id_bin', nullable: true })
  contextUserIdBin: string | null;

  @Column({ name: 'context_parent_id_bin', nullable: true })
  contextParentIdBin: string | null;

  @Column('integer', { name: 'metadata_id', nullable: true })
  metadataId: number | null;

  @ManyToOne(() => StateAttributes, (stateAttributes) => stateAttributes.states)
  @JoinColumn([{ name: 'attributes_id', referencedColumnName: 'attributesId' }])
  attributes_2: StateAttributes;

  @ManyToOne(() => StatesMeta, (statesMeta) => statesMeta.states)
  @JoinColumn([{ name: 'metadata_id', referencedColumnName: 'metadataId' }])
  metadata: StatesMeta;

  @ManyToOne(() => States, (states) => states.states)
  @JoinColumn([{ name: 'old_state_id', referencedColumnName: 'stateId' }])
  oldState: this;

  @OneToMany(() => States, (states) => states.oldState)
  // eslint-disable-next-line no-use-before-define
  states: States[];
}
