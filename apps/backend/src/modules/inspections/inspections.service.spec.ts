import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InspectionsService } from './inspections.service';

describe('InspectionsService', () => {
  const mockRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  let service: InspectionsService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        InspectionsService,
        { provide: 'INSPECTION_REPOSITORY', useValue: mockRepo },
      ],
    }).compile();
    service = moduleRef.get(InspectionsService);
  });

  it('create inicia como draft, sem fotos', async () => {
    mockRepo.create.mockImplementation((i: any) => i);
    mockRepo.save.mockImplementation((i: any) =>
      Promise.resolve({ id: '1', ...i }),
    );
    const res: any = await service.create(
      { vehicleId: 'v1', inspectionType: 'pre_trip' },
      'driver1',
    );
    expect(mockRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'draft',
        vehicleId: 'v1',
        driverId: 'driver1',
      }),
    );
    expect(res.status).toBe('draft');
  });

  it('addPhotos acumula e atualiza totalPhotos', async () => {
    mockRepo.findOne.mockResolvedValue({ id: '1', status: 'draft', photos: [] });
    mockRepo.save.mockImplementation((i: any) => Promise.resolve(i));
    const res: any = await service.addPhotos('1', { photoUrls: ['a', 'b'] });
    expect(res.totalPhotos).toBe(2);
    expect(res.photos).toEqual(['a', 'b']);
  });

  it('addPhotos rejeita inspeção já enviada', async () => {
    mockRepo.findOne.mockResolvedValue({
      id: '1',
      status: 'completed',
      photos: [],
    });
    await expect(
      service.addPhotos('1', { photoUrls: ['a'] }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('submit exige 6 fotos', async () => {
    mockRepo.findOne.mockResolvedValue({
      id: '1',
      status: 'draft',
      photos: ['a'],
      signatureDigital: 'sig',
    });
    await expect(service.submitInspection('1')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('submit exige assinatura', async () => {
    mockRepo.findOne.mockResolvedValue({
      id: '1',
      status: 'draft',
      photos: ['1', '2', '3', '4', '5', '6'],
      signatureDigital: null,
    });
    await expect(service.submitInspection('1')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('submit conclui quando válido', async () => {
    mockRepo.findOne.mockResolvedValue({
      id: '1',
      status: 'draft',
      photos: ['1', '2', '3', '4', '5', '6'],
      signatureDigital: 'sig',
    });
    mockRepo.save.mockImplementation((i: any) => Promise.resolve(i));
    const res = await service.submitInspection('1');
    expect(res.inspection.status).toBe('completed');
  });

  it('findOne lança NotFound', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.findOne('x')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
