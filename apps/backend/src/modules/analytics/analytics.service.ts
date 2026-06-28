import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DataSource, MoreThanOrEqual } from 'typeorm';
import {
  Vehicle,
  Inspection,
  Driver,
  MaintenanceSchedule,
} from '@database/entities';

const ALERT_WINDOW_KM = 15000;

function avg(nums: number[]): number {
  const valid = nums.filter((n) => !Number.isNaN(n));
  if (valid.length === 0) return 0;
  return valid.reduce((s, n) => s + n, 0) / valid.length;
}

function round(n: number, digits = 2): number {
  const f = Math.pow(10, digits);
  return Math.round(n * f) / f;
}

function sinceDate(periodDays: number): Date {
  return new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000);
}

@Injectable()
export class AnalyticsService {
  constructor(
    @Inject('DATA_SOURCE')
    private dataSource: DataSource,
  ) {}

  private repos() {
    return {
      vehicles: this.dataSource.getRepository(Vehicle),
      inspections: this.dataSource.getRepository(Inspection),
      drivers: this.dataSource.getRepository(Driver),
      schedules: this.dataSource.getRepository(MaintenanceSchedule),
    };
  }

  private async computeMaintenance() {
    const { schedules, vehicles } = this.repos();
    const [allSchedules, allVehicles] = await Promise.all([
      schedules.find({ where: { isActive: true } }),
      vehicles.find(),
    ]);
    const kmByVehicle = new Map(
      allVehicles.map((v) => [v.id, Number(v.currentKm) || 0]),
    );
    let alerts = 0;
    let critical = 0;
    for (const s of allSchedules) {
      const kmRemaining = s.nextDueKm - (kmByVehicle.get(s.vehicleId) || 0);
      if (kmRemaining <= ALERT_WINDOW_KM) {
        alerts++;
        if (kmRemaining <= 0) critical++;
      }
    }
    return {
      totalSchedules: allSchedules.length,
      alerts,
      critical,
    };
  }

  async getFleetAnalytics(period: string) {
    const periodDays = parseInt(period, 10) || 30;
    const { vehicles, inspections, drivers } = this.repos();

    const [allVehicles, allDrivers, completedInPeriod, maint] =
      await Promise.all([
        vehicles.find(),
        drivers.find(),
        inspections.count({
          where: {
            status: 'completed',
            inspectionDate: MoreThanOrEqual(sinceDate(periodDays)),
          },
        }),
        this.computeMaintenance(),
      ]);

    const healthScores = allVehicles.map((v) => Number(v.healthScore) || 0);
    const compliant = healthScores.filter((h) => h >= 70).length;

    return {
      period: `${periodDays} days`,
      totalVehicles: allVehicles.length,
      avgHealthScore: round(avg(healthScores), 1),
      totalKmTraveled: allVehicles.reduce(
        (s, v) => s + (Number(v.currentKm) || 0),
        0,
      ),
      totalFuelExpense: round(
        allDrivers.reduce((s, d) => s + (Number(d.fuelExpense) || 0), 0),
      ),
      avgFuelEfficiency: round(
        avg(
          allDrivers
            .map((d) => Number(d.fuelEfficiency) || 0)
            .filter((n) => n > 0),
        ),
        1,
      ),
      inspectionsCompleted: completedInPeriod,
      maintenanceAlerts: maint.alerts,
      criticalAlerts: maint.critical,
      complianceRate: allVehicles.length
        ? round((compliant / allVehicles.length) * 100, 1)
        : 0,
    };
  }

  async getDriverAnalytics(driverId: string, period: string) {
    const periodDays = parseInt(period, 10) || 30;
    const { drivers, inspections } = this.repos();

    const driver = await drivers.findOne({ where: { id: driverId } });
    if (!driver) {
      throw new NotFoundException(`Driver with ID ${driverId} not found`);
    }

    const completedInPeriod = await inspections.count({
      where: {
        driverId,
        status: 'completed',
        inspectionDate: MoreThanOrEqual(sinceDate(periodDays)),
      },
    });

    return {
      driverId,
      period: `${periodDays} days`,
      totalKm: Number(driver.totalKm) || 0,
      fuelExpense: round(Number(driver.fuelExpense) || 0),
      fuelEfficiency: round(Number(driver.fuelEfficiency) || 0, 1),
      inspectionsCompleted: completedInPeriod,
      inspectionsCompletedTotal: driver.inspectionsCompleted,
      avgInspectionTime: driver.avgInspectionTimeMinutes,
      qualityScore: round(Number(driver.inspectionQualityScore) || 0, 1),
    };
  }

  async getVehicleAnalytics(vehicleId: string) {
    const { vehicles, inspections, schedules } = this.repos();

    const vehicle = await vehicles.findOne({ where: { id: vehicleId } });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${vehicleId} not found`);
    }

    const vehicleInspections = await inspections.find({
      where: { vehicleId },
      order: { inspectionDate: 'DESC' },
    });
    const vehicleSchedules = await schedules.find({
      where: { vehicleId, isActive: true },
      order: { nextDueKm: 'ASC' },
    });

    const currentKm = Number(vehicle.currentKm) || 0;
    const nextSchedule = vehicleSchedules[0];
    const nextMaintenance = nextSchedule
      ? `${nextSchedule.component} - ${(nextSchedule.nextDueKm - currentKm).toLocaleString('pt-BR')} km`
      : null;

    return {
      vehicleId,
      currentKm,
      healthScore: Number(vehicle.healthScore) || 0,
      lastInspection: vehicleInspections[0]?.inspectionDate ?? null,
      nextMaintenance,
      totalInspections: vehicleInspections.length,
      avgInspectionQuality: round(
        avg(vehicleInspections.map((i) => Number(i.aiQualityScore) || 0)),
        2,
      ),
      damagesHistory: vehicleInspections.reduce(
        (s, i) => s + (Number(i.damageCount) || 0),
        0,
      ),
    };
  }

  async getExpenseReport(period: string) {
    const periodDays = parseInt(period, 10) || 30;
    const { drivers, vehicles } = this.repos();
    const [allDrivers, allVehicles] = await Promise.all([
      drivers.find(),
      vehicles.find(),
    ]);

    const fuel = round(
      allDrivers.reduce((s, d) => s + (Number(d.fuelExpense) || 0), 0),
    );
    const totalKm = allVehicles.reduce(
      (s, v) => s + (Number(v.currentKm) || 0),
      0,
    );
    const totalExpense = fuel;

    return {
      period: `${periodDays} days`,
      totalExpense,
      breakdown: {
        fuel,
        maintenance: 0,
        tolls: 0,
      },
      avgDailyExpense: round(totalExpense / periodDays),
      costPerKm: totalKm ? round(totalExpense / totalKm, 3) : 0,
    };
  }

  async getMaintenanceReport() {
    const maint = await this.computeMaintenance();
    return {
      totalScheduledMaintenance: maint.totalSchedules,
      pendingMaintenance: maint.alerts,
      overdueMaintenance: maint.critical,
      upcomingMaintenance: maint.alerts - maint.critical,
    };
  }

  async getComplianceReport(period: string) {
    const periodDays = parseInt(period, 10) || 30;
    const { vehicles, inspections } = this.repos();
    const [allVehicles, inspected] = await Promise.all([
      vehicles.find(),
      inspections.find({ select: ['vehicleId'] }),
    ]);
    const inspectedSet = new Set(inspected.map((i) => i.vehicleId));
    const withInspection = allVehicles.filter((v) =>
      inspectedSet.has(v.id),
    ).length;
    const compliantHealth = allVehicles.filter(
      (v) => (Number(v.healthScore) || 0) >= 70,
    ).length;

    const inspectionCompliance = allVehicles.length
      ? round((withInspection / allVehicles.length) * 100, 1)
      : 0;
    const maintenanceCompliance = allVehicles.length
      ? round((compliantHealth / allVehicles.length) * 100, 1)
      : 0;

    return {
      period: `${periodDays} days`,
      inspectionCompliance,
      maintenanceCompliance,
      overallCompliance: round(
        (inspectionCompliance + maintenanceCompliance) / 2,
        1,
      ),
    };
  }
}
