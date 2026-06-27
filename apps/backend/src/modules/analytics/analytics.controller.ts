import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('fleet')
  getFleetAnalytics(@Query('period') period: string = '30') {
    return this.analyticsService.getFleetAnalytics(period);
  }

  @Get('driver/:driverId')
  getDriverAnalytics(@Param('driverId') driverId: string, @Query('period') period: string = '30') {
    return this.analyticsService.getDriverAnalytics(driverId, period);
  }

  @Get('vehicle/:vehicleId')
  getVehicleAnalytics(@Param('vehicleId') vehicleId: string) {
    return this.analyticsService.getVehicleAnalytics(vehicleId);
  }

  @Get('reports/expense')
  getExpenseReport(@Query('period') period: string = '30') {
    return this.analyticsService.getExpenseReport(period);
  }

  @Get('reports/maintenance')
  getMaintenanceReport() {
    return this.analyticsService.getMaintenanceReport();
  }

  @Get('reports/compliance')
  getComplianceReport(@Query('period') period: string = '30') {
    return this.analyticsService.getComplianceReport(period);
  }
}
