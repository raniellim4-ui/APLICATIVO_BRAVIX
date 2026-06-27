import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

interface Vehicle {
  id: string;
  plate: string;
  model: string;
  make: string;
  year: number;
  vin: string;
  currentKm: number;
  healthScore: number;
  lastInspection: Date;
  createdAt: Date;
}

@Injectable()
export class VehiclesService {
  private vehicles: Map<string, Vehicle> = new Map();

  constructor() {
    this.initializeMockVehicles();
  }

  private initializeMockVehicles() {
    const mockVehicles: Vehicle[] = [
      {
        id: uuidv4(),
        plate: 'ABC-1234',
        model: 'Volvo FH16',
        make: 'Volvo',
        year: 2023,
        vin: 'YV2FM02G8F1234567',
        currentKm: 45000,
        healthScore: 94,
        lastInspection: new Date(),
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        plate: 'XYZ-5678',
        model: 'Scania R450',
        make: 'Scania',
        year: 2022,
        vin: 'XSC95DXP1GJ245680',
        currentKm: 78000,
        healthScore: 87,
        lastInspection: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
      },
    ];

    mockVehicles.forEach((vehicle) => {
      this.vehicles.set(vehicle.id, vehicle);
    });
  }

  findAll() {
    return {
      total: this.vehicles.size,
      vehicles: Array.from(this.vehicles.values()),
    };
  }

  findOne(id: string) {
    const vehicle = this.vehicles.get(id);
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
    return vehicle;
  }

  create(createVehicleDto: any) {
    const id = uuidv4();
    const vehicle: Vehicle = {
      id,
      ...createVehicleDto,
      healthScore: 100,
      lastInspection: new Date(),
      createdAt: new Date(),
    };
    this.vehicles.set(id, vehicle);
    return vehicle;
  }

  update(id: string, updateVehicleDto: any) {
    const vehicle = this.findOne(id);
    const updated = { ...vehicle, ...updateVehicleDto };
    this.vehicles.set(id, updated);
    return updated;
  }

  remove(id: string) {
    const vehicle = this.findOne(id);
    this.vehicles.delete(id);
    return { message: 'Vehicle deleted successfully', vehicle };
  }
}
