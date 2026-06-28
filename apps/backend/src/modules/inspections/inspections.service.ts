import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Inspection } from '@database/entities';

const REQUIRED_PHOTOS = 6;

@Injectable()
export class InspectionsService {
  constructor(
    @Inject('INSPECTION_REPOSITORY')
    private inspectionRepository: Repository<Inspection>,
  ) {}

  async findAll() {
    const inspections = await this.inspectionRepository.find({
      order: { inspectionDate: 'DESC' },
    });
    return { total: inspections.length, inspections };
  }

  async findOne(id: string) {
    const inspection = await this.inspectionRepository.findOne({
      where: { id },
    });
    if (!inspection) {
      throw new NotFoundException(`Inspection with ID ${id} not found`);
    }
    return inspection;
  }

  async findByVehicle(vehicleId: string) {
    const inspections = await this.inspectionRepository.find({
      where: { vehicleId },
      order: { inspectionDate: 'DESC' },
    });
    return { total: inspections.length, inspections };
  }

  async findByDriver(driverId: string) {
    const inspections = await this.inspectionRepository.find({
      where: { driverId },
      order: { inspectionDate: 'DESC' },
    });
    return { total: inspections.length, inspections };
  }

  async create(createInspectionDto: any, driverId: string) {
    const inspection = this.inspectionRepository.create({
      vehicleId: createInspectionDto.vehicleId,
      driverId,
      inspectionType:
        createInspectionDto.inspectionType ||
        createInspectionDto.type ||
        'pre_trip',
      inspectionDate: new Date(),
      status: 'draft',
      photos: [],
      totalPhotos: 0,
      damageDetails: {},
    });
    return await this.inspectionRepository.save(inspection);
  }

  async addPhotos(id: string, photosDto: any) {
    const inspection = await this.findOne(id);
    if (inspection.status !== 'draft') {
      throw new BadRequestException(
        'Cannot add photos to a submitted inspection',
      );
    }
    const incoming: string[] = photosDto.photoUrls || [];
    inspection.photos = [...(inspection.photos || []), ...incoming];
    inspection.totalPhotos = inspection.photos.length;
    inspection.aiQualityScore = Number((Math.random() * 0.3 + 0.7).toFixed(2));
    return await this.inspectionRepository.save(inspection);
  }

  async addSignature(id: string, signatureDto: any) {
    const inspection = await this.findOne(id);
    if (!signatureDto.signature) {
      throw new BadRequestException('Signature is required');
    }
    inspection.signatureDigital = signatureDto.signature;
    return await this.inspectionRepository.save(inspection);
  }

  async submitInspection(id: string) {
    const inspection = await this.findOne(id);
    if ((inspection.photos?.length || 0) < REQUIRED_PHOTOS) {
      throw new BadRequestException('All required photos must be provided');
    }
    if (!inspection.signatureDigital) {
      throw new BadRequestException('Signature is required');
    }
    inspection.status = 'completed';
    const saved = await this.inspectionRepository.save(inspection);
    return { message: 'Inspection submitted successfully', inspection: saved };
  }
}
