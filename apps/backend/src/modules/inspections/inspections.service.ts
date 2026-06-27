import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

interface Inspection {
  id: string;
  vehicleId: string;
  driverId: string;
  inspectionDate: Date;
  type: string;
  status: string;
  photos: string[];
  damageDetails: any;
  signature: string | null;
  totalPhotos: number;
  aiQualityScore: number;
  createdAt: Date;
}

@Injectable()
export class InspectionsService {
  private inspections: Map<string, Inspection> = new Map();

  constructor() {
    this.initializeMockInspections();
  }

  private initializeMockInspections() {
    const mockInspections: Inspection[] = [
      {
        id: uuidv4(),
        vehicleId: uuidv4(),
        driverId: uuidv4(),
        inspectionDate: new Date(),
        type: 'pre_trip',
        status: 'completed',
        photos: [],
        damageDetails: {},
        signature: null,
        totalPhotos: 6,
        aiQualityScore: 0.94,
        createdAt: new Date(),
      },
    ];

    mockInspections.forEach((inspection) => {
      this.inspections.set(inspection.id, inspection);
    });
  }

  findAll() {
    return {
      total: this.inspections.size,
      inspections: Array.from(this.inspections.values()),
    };
  }

  findOne(id: string) {
    const inspection = this.inspections.get(id);
    if (!inspection) {
      throw new NotFoundException(`Inspection with ID ${id} not found`);
    }
    return inspection;
  }

  create(createInspectionDto: any, driverId: string) {
    const id = uuidv4();
    const inspection: Inspection = {
      id,
      driverId,
      ...createInspectionDto,
      inspectionDate: new Date(),
      status: 'draft',
      photos: [],
      damageDetails: {},
      signature: null,
      totalPhotos: 0,
      aiQualityScore: 0,
      createdAt: new Date(),
    };
    this.inspections.set(id, inspection);
    return inspection;
  }

  findByVehicle(vehicleId: string) {
    const inspections = Array.from(this.inspections.values()).filter(
      (i) => i.vehicleId === vehicleId,
    );
    return { total: inspections.length, inspections };
  }

  findByDriver(driverId: string) {
    const inspections = Array.from(this.inspections.values()).filter(
      (i) => i.driverId === driverId,
    );
    return { total: inspections.length, inspections };
  }

  addPhotos(id: string, photosDto: any) {
    const inspection = this.findOne(id);
    if (inspection.status !== 'draft') {
      throw new BadRequestException(
        'Cannot add photos to a submitted inspection',
      );
    }
    inspection.photos.push(...(photosDto.photoUrls || []));
    inspection.totalPhotos = inspection.photos.length;
    inspection.aiQualityScore = Math.random() * 0.3 + 0.7;
    return inspection;
  }

  addSignature(id: string, signatureDto: any) {
    const inspection = this.findOne(id);
    if (!signatureDto.signature) {
      throw new BadRequestException('Signature is required');
    }
    inspection.signature = signatureDto.signature;
    return inspection;
  }

  submitInspection(id: string) {
    const inspection = this.findOne(id);
    if (inspection.photos.length < 6) {
      throw new BadRequestException('All required photos must be provided');
    }
    if (!inspection.signature) {
      throw new BadRequestException('Signature is required');
    }
    inspection.status = 'completed';
    return { message: 'Inspection submitted successfully', inspection };
  }
}
