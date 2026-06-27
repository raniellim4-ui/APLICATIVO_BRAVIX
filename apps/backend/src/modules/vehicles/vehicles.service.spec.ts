import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesService } from './vehicles.service';
import { NotFoundException } from '@nestjs/common';

describe('VehiclesService', () => {
  let service: VehiclesService;
  let mockRepository;

  beforeEach(async () => {
    mockRepository = {
      find: jest.fn().mockResolvedValue([
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          plate: 'ABC-1234',
          model: 'Volvo FH16',
          make: 'Volvo',
          year: 2023,
          currentKm: 45000,
          healthScore: 94,
        },
      ]),
      findOne: jest.fn().mockResolvedValue({
        id: '123e4567-e89b-12d3-a456-426614174000',
        plate: 'ABC-1234',
        model: 'Volvo FH16',
      }),
      create: jest.fn().mockReturnValue({
        id: '123e4567-e89b-12d3-a456-426614174000',
        plate: 'NEW-1234',
        model: 'MAN TGX',
      }),
      save: jest.fn().mockResolvedValue({
        id: '123e4567-e89b-12d3-a456-426614174000',
        plate: 'NEW-1234',
        model: 'MAN TGX',
      }),
      remove: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiclesService,
        {
          provide: 'VEHICLE_REPOSITORY',
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<VehiclesService>(VehiclesService);
  });

  describe('findAll', () => {
    it('should return an array of vehicles', async () => {
      const result = await service.findAll();

      expect(result.total).toBe(1);
      expect(result.vehicles).toHaveLength(1);
      expect(result.vehicles[0].plate).toBe('ABC-1234');
    });
  });

  describe('findOne', () => {
    it('should return a single vehicle', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const result = await service.findOne(id);

      expect(result.plate).toBe('ABC-1234');
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id } });
    });

    it('should throw NotFoundException when vehicle not found', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);
      const id = 'non-existent-id';

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new vehicle', async () => {
      const createVehicleDto = {
        plate: 'NEW-1234',
        model: 'MAN TGX',
        make: 'MAN',
        year: 2024,
        vin: 'WBADV990040000001',
        registrationDate: new Date(),
      };

      const result = await service.create(createVehicleDto);

      expect(result.plate).toBe('NEW-1234');
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...createVehicleDto,
          healthScore: 100,
          currentKm: 0,
        }),
      );
    });
  });

  describe('update', () => {
    it('should update a vehicle', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updateVehicleDto = { currentKm: 50000 };

      mockRepository.save.mockResolvedValueOnce({
        id,
        plate: 'ABC-1234',
        currentKm: 50000,
      });

      const result = await service.update(id, updateVehicleDto);

      expect(result.currentKm).toBe(50000);
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a vehicle', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';

      const result = await service.remove(id);

      expect(result.message).toBe('Vehicle deleted successfully');
      expect(mockRepository.remove).toHaveBeenCalled();
    });
  });
});
