import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventService } from './event.service';
import { Events } from '../entities/homeass/2024.1.5/Events';
import { EventData } from '../entities/homeass/2024.1.5/EventData';

@Module({
  imports: [TypeOrmModule.forFeature([Events, EventData], 'homeass')],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
