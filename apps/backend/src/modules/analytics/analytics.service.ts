import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsService {
  getFleetAnalytics(period: string) {
    return {
      period: `${period} days`,
      totalVehicles: 10,
      avgHealthScore: 91.5,
      totalKmTraveled: 125000,
      totalFuelExpense: 18500,
      avgFuelEfficiency: 4.3,
      inspectionsCompleted: 156,
      maintenanceAlerts: 8,
      criticalAlerts: 2,
      complianceRate: 98.5,
    };
  }

  getDriverAnalytics(driverId: string, period: string) {
    return {
      driverId,
      period: `${period} days`,
      totalKm: 12500,
      fuelExpense: 1850,
      fuelEfficiency: 4.2,
      inspectionsCompleted: 16,
      avgInspectionTime: 18,
      qualityScore: 4.7,
      safetyIncidents: 0,
      complianceRate: 100,
    };
  }

  getVehicleAnalytics(vehicleId: string) {
    return {
      vehicleId,
      currentKm: 45000,
      healthScore: 94,
      lastInspection: new Date(),
      nextMaintenance: 'Oil Change - 5,000 km',
      totalInspections: 24,
      avgInspectionQuality: 0.92,
      damagesHistory: 3,
      fuelEfficiencyTrend: '+2.1%',
    };
  }

  getExpenseReport(period: string) {
    return {
      period: `${period} days`,
      totalExpense: 18500,
      breakdown: {
        fuel: 12500,
        maintenance: 4200,
        tolls: 1800,
      },
      avgDailyExpense: 616.67,
      costPerKm: 0.148,
      vehicles: [
        { plate: 'ABC-1234', expense: 9250 },
        { plate: 'XYZ-5678', expense: 9250 },
      ],
    };
  }

  getMaintenanceReport() {
    return {
      totalScheduledMaintenance: 15,
      completedMaintenance: 12,
      pendingMaintenance: 3,
      overdueMaintenance: 0,
      upcomingMaintenance: 5,
      estimatedCost: 8500,
      avgCostPerVehicle: 850,
    };
  }

  getComplianceReport(period: string) {
    return {
      period: `${period} days`,
      inspectionCompliance: 98.5,
      maintenanceCompliance: 96.2,
      documentationCompliance: 100,
      safetyCompliance: 99.1,
      overallCompliance: 98.45,
      issues: [
        { type: 'Missed Inspection', count: 2, vehicle: 'ABC-1234' },
      ],
    };
  }
}
