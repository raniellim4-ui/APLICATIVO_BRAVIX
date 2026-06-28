import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MaintenanceSchedule, Vehicle } from '@database/entities';

// Janela (km) a partir da qual um agendamento vira "alerta"
const ALERT_WINDOW_KM = 15000;
const WARNING_KM = 5000;

type Severity = 'info' | 'warning' | 'critical';

@Injectable()
export class MaintenanceService {
  constructor(
    @Inject('MAINTENANCE_SCHEDULE_REPOSITORY')
    private scheduleRepository: Repository<MaintenanceSchedule>,
  ) {}

  private get vehicleRepository(): Repository<Vehicle> {
    return this.scheduleRepository.manager.getRepository(Vehicle);
  }

  private severityFor(kmRemaining: number): Severity {
    if (kmRemaining <= 0) return 'critical';
    if (kmRemaining <= WARNING_KM) return 'warning';
    return 'info';
  }

  private messageFor(component: string, kmRemaining: number): string {
    if (kmRemaining <= 0) {
      return `${component}: vencida há ${Math.abs(kmRemaining).toLocaleString('pt-BR')} km`;
    }
    return `${component}: vence em ${kmRemaining.toLocaleString('pt-BR')} km`;
  }

  private daysRemaining(nextDueDate?: Date | null): number | undefined {
    if (!nextDueDate) return undefined;
    const diff = new Date(nextDueDate).getTime() - Date.now();
    return Math.round(diff / (24 * 60 * 60 * 1000));
  }

  private buildAlert(schedule: MaintenanceSchedule, currentKm: number) {
    const kmRemaining = schedule.nextDueKm - currentKm;
    return {
      id: schedule.id,
      severity: this.severityFor(kmRemaining),
      component: schedule.component,
      message: this.messageFor(schedule.component, kmRemaining),
      kmRemaining,
      daysRemaining: this.daysRemaining(schedule.nextDueDate),
    };
  }

  async getScheduleByVehicle(vehicleId: string) {
    const schedules = await this.scheduleRepository.find({
      where: { vehicleId, isActive: true },
      order: { nextDueKm: 'ASC' },
    });
    return {
      vehicleId,
      schedules: schedules.map((s) => ({
        id: s.id,
        component: s.component,
        maintenanceType: s.maintenanceType,
        recommendedKm: s.recommendedKm,
        nextDueKm: s.nextDueKm,
        lastServiceKm: s.lastPerformedKm,
        lastServiceDate: s.lastPerformedDate,
      })),
    };
  }

  async getAlertsByVehicle(vehicleId: string) {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id: vehicleId },
    });
    const currentKm = Number(vehicle?.currentKm) || 0;
    const schedules = await this.scheduleRepository.find({
      where: { vehicleId, isActive: true },
      order: { nextDueKm: 'ASC' },
    });
    const alerts = schedules
      .map((s) => this.buildAlert(s, currentKm))
      .filter((a) => a.kmRemaining <= ALERT_WINDOW_KM);
    return { vehicleId, alerts };
  }

  async getAllAlerts() {
    const [schedules, vehicles] = await Promise.all([
      this.scheduleRepository.find({ where: { isActive: true } }),
      this.vehicleRepository.find(),
    ]);
    const vehicleMap = new Map(vehicles.map((v) => [v.id, v]));

    const alerts = schedules
      .map((s) => {
        const vehicle = vehicleMap.get(s.vehicleId);
        const currentKm = Number(vehicle?.currentKm) || 0;
        const base = this.buildAlert(s, currentKm);
        return {
          ...base,
          vehicleId: s.vehicleId,
          plate: vehicle?.plate ?? null,
        };
      })
      .filter((a) => a.kmRemaining <= ALERT_WINDOW_KM)
      .sort((a, b) => a.kmRemaining - b.kmRemaining);

    const criticalAlerts = alerts.filter((a) => a.severity === 'critical').length;
    const warningAlerts = alerts.filter((a) => a.severity === 'warning').length;
    const infoAlerts = alerts.filter((a) => a.severity === 'info').length;

    return {
      total: alerts.length,
      criticalAlerts,
      warningAlerts,
      infoAlerts,
      alerts,
    };
  }

  async createSchedule(vehicleId: string, scheduleDto: any) {
    const schedule = this.scheduleRepository.create({
      vehicleId,
      maintenanceType: scheduleDto.maintenanceType || 'generic',
      component: scheduleDto.component,
      recommendedKm: scheduleDto.recommendedKm,
      alertThresholdKm:
        scheduleDto.alertThresholdKm ??
        Math.max(0, (scheduleDto.recommendedKm || 0) - 1000),
      nextDueKm: scheduleDto.nextDueKm,
      nextDueDate: scheduleDto.nextDueDate,
      lastPerformedKm: scheduleDto.lastPerformedKm,
      lastPerformedDate: scheduleDto.lastPerformedDate,
      isActive: true,
    });
    return await this.scheduleRepository.save(schedule);
  }

  async recordMaintenance(vehicleId: string, maintenanceDto: any) {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: maintenanceDto.scheduleId, vehicleId },
    });
    if (!schedule) {
      // Sem agendamento associado: apenas registra o evento de forma simples
      return {
        vehicleId,
        ...maintenanceDto,
        recordedAt: new Date(),
        status: 'completed',
      };
    }
    const performedKm = Number(maintenanceDto.performedKm) || schedule.nextDueKm;
    schedule.lastPerformedKm = performedKm;
    schedule.lastPerformedDate = new Date();
    schedule.nextDueKm = performedKm + schedule.recommendedKm;
    schedule.alertSent = false;
    return await this.scheduleRepository.save(schedule);
  }
}
