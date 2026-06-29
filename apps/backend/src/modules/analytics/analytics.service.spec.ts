import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  const vehicleRepo = { find: jest.fn(), findOne: jest.fn(), count: jest.fn() };
  const inspectionRepo = { find: jest.fn(), findOne: jest.fn(), count: jest.fn() };
  const driverRepo = { find: jest.fn(), findOne: jest.fn(), count: jest.fn() };
  const scheduleRepo = { find: jest.fn(), findOne: jest.fn(), count: jest.fn() };

  const dataSource = {
    getRepository: jest.fn((entity: any) => {
      switch (entity?.name) {
        case 'Vehicle':
          return vehicleRepo;
        case 'Inspection':
          return inspectionRepo;
        case 'Driver':
          return driverRepo;
        case 'MaintenanceSchedule':
          return scheduleRepo;
        default:
          return null;
      }
    }),
  };

  let service: AnalyticsService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        { provide: 'DATA_SOURCE', useValue: dataSource },
      ],
    }).compile();
    service = moduleRef.get(AnalyticsService);
  });

  it('getFleetAnalytics agrega veículos/saúde/compliance', async () => {
    vehicleRepo.find.mockResolvedValue([
      { healthScore: 94, currentKm: 45000 },
      { healthScore: 64, currentKm: 198700 },
    ]);
    driverRepo.find.mockResolvedValue([
      { fuelExpense: 8500, fuelEfficiency: 4.5 },
    ]);
    inspectionRepo.count.mockResolvedValue(3);
    scheduleRepo.find.mockResolvedValue([]);

    const res = await service.getFleetAnalytics('30');
    expect(res.totalVehicles).toBe(2);
    expect(res.avgHealthScore).toBe(79);
    expect(res.complianceRate).toBe(50);
    expect(res.inspectionsCompleted).toBe(3);
    expect(res.totalKmTraveled).toBe(243700);
    expect(res.totalFuelExpense).toBe(8500);
  });

  it('getVehicleAnalytics calcula qualidade e próxima manutenção', async () => {
    vehicleRepo.findOne.mockResolvedValue({
      id: 'v1',
      currentKm: 45000,
      healthScore: 94,
    });
    inspectionRepo.find.mockResolvedValue([
      { inspectionDate: '2026-06-28', aiQualityScore: 0.9, damageCount: 1 },
      { inspectionDate: '2026-06-20', aiQualityScore: 0.8, damageCount: 0 },
    ]);
    scheduleRepo.find.mockResolvedValue([
      { component: 'Óleo', nextDueKm: 50000 },
    ]);

    const res = await service.getVehicleAnalytics('v1');
    expect(res.totalInspections).toBe(2);
    expect(res.avgInspectionQuality).toBe(0.85);
    expect(res.damagesHistory).toBe(1);
    expect(res.nextMaintenance).toContain('Óleo');
  });

  it('getVehicleAnalytics lança NotFound', async () => {
    vehicleRepo.findOne.mockResolvedValue(null);
    await expect(service.getVehicleAnalytics('x')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('getDriverAnalytics usa dados do motorista + inspeções no período', async () => {
    driverRepo.findOne.mockResolvedValue({
      id: 'd1',
      totalKm: 12500,
      fuelExpense: 1850,
      fuelEfficiency: 4.2,
      inspectionQualityScore: 4.7,
      avgInspectionTimeMinutes: 18,
      inspectionsCompleted: 16,
    });
    inspectionRepo.count.mockResolvedValue(5);

    const res = await service.getDriverAnalytics('d1', '30');
    expect(res.totalKm).toBe(12500);
    expect(res.inspectionsCompleted).toBe(5);
    expect(res.qualityScore).toBe(4.7);
  });

  it('getDriverAnalytics lança NotFound', async () => {
    driverRepo.findOne.mockResolvedValue(null);
    await expect(
      service.getDriverAnalytics('x', '30'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
