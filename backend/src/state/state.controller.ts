import { Controller, Get, Param } from '@nestjs/common';
import { StateService } from './state.service';

@Controller('state')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Get('countStates')
  async countEventTypes() {
    return this.stateService.countEventTypes();
  }

  @Get('countAttributesSize')
  async countAttributesSize() {
    return this.stateService.countAttributesSize();
  }
}
