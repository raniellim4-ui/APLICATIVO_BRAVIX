import { Test } from '@nestjs/testing';
import { MaintenanceService } from './maintenance.service';

describe('MaintenanceService', () => {
  const vehicleRepo = { find: jest.fn(), findOne: jest.fn() };
  const scheduleRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    manager: { getRepository: jest.fn().mockReturnValue(vehicleRepo) },
  };
  let service: MaintenanceService;

  beforeEach(async () => {
    jest.clearAllMocks();
    scheduleRepo.manager.getRepository.mockReturnValue(vehicleRepo);
    const moduleRef = await Test.createTestingModule({
      providers: [
        MaintenanceService,
        { provide: 'MAINTENANCE_SCHEDULE_REPOSITORY', useValue: scheduleRepo },
      ],
    }).compile();
    service = moduleRef.get(MaintenanceService);
  });

  it('getAlertsByVehicle classifica severidade por km restante', async () => {
    vehicleRepo.findOne.mockResolvedValue({ id: 'v1', currentKm: 45000 });
    scheduleRepo.find.mockResolvedValue([
      { id: 's1', component: 'Oil', nextDueKm: 50000, isActive: true },
      { id: 's2', component: 'Tires', nextDueKm: 60000, isActive: true },
    ]);
    const res = await service.getAlertsByVehicle('v1');
    expect(res.alerts).toHaveLength(2);
    expect(res.alerts[0].severity).toBe('warning'); // 5000 km
    expect(res.alerts[1].severity).toBe('info'); // 15000 km
  });

  it('getAlertsByVehicle ignora agendamentos fora da janela', async () => {
    vehicleRepo.findOne.mockResolvedValue({ id: 'v1', currentKm: 10000 });
    scheduleRepo.find.mockResolvedValue([
      { id: 's1', component: 'Oil', nextDueKm: 100000, isActive: true }, // 90000 km > 15000
    ]);
    const res = await service.getAlertsByVehicle('v1');
    expect(res.alerts).toHaveLength(0);
  });

  it('getAllAlerts marca crítico para vencido e traz a placa', async () => {
    scheduleRepo.find.mockResolvedValue([
      { id: 's1', component: 'Oil', nextDueKm: 40000, vehicleId: 'v1', isActive: true },
    ]);
    vehicleRepo.find.mockResolvedValue([
      { id: 'v1', plate: 'ABC-1234', currentKm: 45000 }, // -5000 km => crítico
    ]);
    const res = await service.getAllAlerts();
    expect(res.total).toBe(1);
    expect(res.criticalAlerts).toBe(1);
    expect(res.alerts[0].plate).toBe('ABC-1234');
    expect(res.alerts[0].severity).toBe('critical');
  });

  it('recordMaintenance avança o nextDueKm pelo recommendedKm', async () => {
    scheduleRepo.findOne.mockResolvedValue({
      id: 's1',
      vehicleId: 'v1',
      recommendedKm: 10000,
      nextDueKm: 50000,
    });
    scheduleRepo.save.mockImplementation((s: any) => Promise.resolve(s));
    const res: any = await service.recordMaintenance('v1', {
      scheduleId: 's1',
      performedKm: 48000,
    });
    expect(res.lastPerformedKm).toBe(48000);
    expect(res.nextDueKm).toBe(58000);
  });
});
