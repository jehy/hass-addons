import { Module } from '@nestjs/common';
import { StateController } from './state.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StateService } from './state.service';
import { States } from '../entities/homeass/2024.1.5/States';
import { StateAttributes } from '../entities/homeass/2024.1.5/StateAttributes';

@Module({
  imports: [TypeOrmModule.forFeature([States, StateAttributes], 'homeass')],
  controllers: [StateController],
  providers: [StateService],
})
export class StateModule {}
