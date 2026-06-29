import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';

describe('VehiclesService', () => {
  const mockRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };
  let service: VehiclesService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        VehiclesService,
        { provide: 'VEHICLE_REPOSITORY', useValue: mockRepo },
      ],
    }).compile();
    service = moduleRef.get(VehiclesService);
  });

  it('findAll retorna total + vehicles', async () => {
    mockRepo.find.mockResolvedValue([{ id: '1', plate: 'ABC-1234' }]);
    const res = await service.findAll();
    expect(res.total).toBe(1);
    expect(res.vehicles[0].plate).toBe('ABC-1234');
  });

  it('findOne lança NotFound quando não existe', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.findOne('x')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('create aplica defaults health 100 / km 0', async () => {
    mockRepo.create.mockImplementation((v: any) => v);
    mockRepo.save.mockImplementation((v: any) =>
      Promise.resolve({ id: '1', ...v }),
    );
    const res: any = await service.create({ plate: 'NEW-1' });
    expect(mockRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ healthScore: 100, currentKm: 0 }),
    );
    expect(res.plate).toBe('NEW-1');
  });

  it('update mescla e salva', async () => {
    mockRepo.findOne.mockResolvedValue({ id: '1', plate: 'ABC', currentKm: 100 });
    mockRepo.save.mockImplementation((v: any) => Promise.resolve(v));
    const res: any = await service.update('1', { currentKm: 500 });
    expect(res.currentKm).toBe(500);
    expect(mockRepo.save).toHaveBeenCalled();
  });

  it('remove exclui e retorna mensagem', async () => {
    mockRepo.findOne.mockResolvedValue({ id: '1', plate: 'ABC' });
    mockRepo.remove.mockResolvedValue(undefined);
    const res = await service.remove('1');
    expect(res.message).toBe('Vehicle deleted successfully');
    expect(mockRepo.remove).toHaveBeenCalled();
  });
});
