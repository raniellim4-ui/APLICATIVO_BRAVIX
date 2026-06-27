import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MaintenanceService {
  private schedules = new Map();
  private alerts = new Map();
  private history = new Map();

  getScheduleByVehicle(vehicleId: string) {
    return {
      vehicleId,
      schedules: [
        {
          id: uuidv4(),
          component: 'Oil Change',
          recommendedKm: 10000,
          nextDueKm: 5000,
          lastServiceKm: 45000,
          lastServiceDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
        {
          id: uuidv4(),
          component: 'Tire Rotation',
          recommendedKm: 20000,
          nextDueKm: 15000,
          lastServiceKm: 30000,
          lastServiceDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        },
      ],
    };
  }

  getAlertsByVehicle(vehicleId: string) {
    return {
      vehicleId,
      alerts: [
        {
          id: uuidv4(),
          severity: 'warning',
          component: 'Oil Change',
          message: 'Oil change due in 5,000 km',
          daysRemaining: 15,
          kmRemaining: 5000,
        },
        {
          id: uuidv4(),
          severity: 'info',
          component: 'Brake Inspection',
          message: 'Next brake inspection in 2 months',
          daysRemaining: 60,
          kmRemaining: 12000,
        },
      ],
    };
  }

  getAllAlerts() {
    return {
      total: 25,
      criticalAlerts: 3,
      warningAlerts: 8,
      infoAlerts: 14,
      alerts: [
        {
          vehicleId: uuidv4(),
          plate: 'ABC-1234',
          severity: 'critical',
          message: 'Engine warning light',
        },
        {
          vehicleId: uuidv4(),
          plate: 'XYZ-5678',
          severity: 'warning',
          message: 'Oil change overdue',
        },
      ],
    };
  }

  createSchedule(vehicleId: string, scheduleDto: any) {
    return {
      id: uuidv4(),
      vehicleId,
      ...scheduleDto,
      createdAt: new Date(),
    };
  }

  recordMaintenance(vehicleId: string, maintenanceDto: any) {
    return {
      id: uuidv4(),
      vehicleId,
      ...maintenanceDto,
      recordedAt: new Date(),
      status: 'completed',
    };
  }
}
