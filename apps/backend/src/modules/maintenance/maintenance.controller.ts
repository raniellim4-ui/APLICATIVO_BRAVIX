import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('maintenance')
@UseGuards(JwtAuthGuard)
export class MaintenanceController {
  constructor(private maintenanceService: MaintenanceService) {}

  @Get('vehicle/:vehicleId')
  getScheduleByVehicle(@Param('vehicleId') vehicleId: string) {
    return this.maintenanceService.getScheduleByVehicle(vehicleId);
  }

  @Get('vehicle/:vehicleId/alerts')
  getAlertsByVehicle(@Param('vehicleId') vehicleId: string) {
    return this.maintenanceService.getAlertsByVehicle(vehicleId);
  }

  @Get('alerts')
  getAllAlerts() {
    return this.maintenanceService.getAllAlerts();
  }

  @Post('vehicle/:vehicleId/schedule')
  createSchedule(@Param('vehicleId') vehicleId: string, @Body() scheduleDto: any) {
    return this.maintenanceService.createSchedule(vehicleId, scheduleDto);
  }

  @Post('vehicle/:vehicleId/record')
  recordMaintenance(@Param('vehicleId') vehicleId: string, @Body() maintenanceDto: any) {
    return this.maintenanceService.recordMaintenance(vehicleId, maintenanceDto);
  }
}
