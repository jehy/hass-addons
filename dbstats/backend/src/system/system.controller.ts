import { Controller, Get, Param } from '@nestjs/common';
import { SystemService } from './system.service';

@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Get('getTableRows')
  async getTableRows() {
    return this.systemService.getTableRows();
  }

  @Get('getTableSize')
  async getTableSize() {
    return this.systemService.getTableSize();
  }
  @Get('getDbAlerts')
  async getDbAlerts() {
    return this.systemService.getDbAlerts();
  }
}
