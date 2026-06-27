import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

interface Driver {
  id: string;
  name: string;
  cnh: string;
  phone: string;
  email: string;
  totalKm: number;
  fuelExpense: number;
  fuelEfficiency: number;
  inspectionQualityScore: number;
  createdAt: Date;
}

@Injectable()
export class DriversService {
  private drivers: Map<string, Driver> = new Map();

  constructor() {
    this.initializeMockDrivers();
  }

  private initializeMockDrivers() {
    const mockDrivers: Driver[] = [
      {
        id: uuidv4(),
        name: 'João Silva',
        cnh: '12345678901',
        phone: '11 99999-8888',
        email: 'joao@example.com',
        totalKm: 45000,
        fuelExpense: 2500,
        fuelEfficiency: 4.5,
        inspectionQualityScore: 4.8,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Maria Santos',
        cnh: '98765432101',
        phone: '11 98888-7777',
        email: 'maria@example.com',
        totalKm: 78000,
        fuelExpense: 4200,
        fuelEfficiency: 4.2,
        inspectionQualityScore: 4.6,
        createdAt: new Date(),
      },
    ];

    mockDrivers.forEach((driver) => {
      this.drivers.set(driver.id, driver);
    });
  }

  findAll() {
    return {
      total: this.drivers.size,
      drivers: Array.from(this.drivers.values()),
    };
  }

  findOne(id: string) {
    const driver = this.drivers.get(id);
    if (!driver) {
      throw new NotFoundException(`Driver with ID ${id} not found`);
    }
    return driver;
  }

  create(createDriverDto: any) {
    const id = uuidv4();
    const driver: Driver = {
      id,
      ...createDriverDto,
      totalKm: 0,
      fuelExpense: 0,
      fuelEfficiency: 0,
      inspectionQualityScore: 5,
      createdAt: new Date(),
    };
    this.drivers.set(id, driver);
    return driver;
  }

  update(id: string, updateDriverDto: any) {
    const driver = this.findOne(id);
    const updated = { ...driver, ...updateDriverDto };
    this.drivers.set(id, updated);
    return updated;
  }

  remove(id: string) {
    const driver = this.findOne(id);
    this.drivers.delete(id);
    return { message: 'Driver deleted successfully', driver };
  }

  getDashboard(id: string) {
    const driver = this.findOne(id);
    return {
      driver,
      stats: {
        totalKm: driver.totalKm,
        fuelExpense: driver.fuelExpense,
        fuelEfficiency: driver.fuelEfficiency,
        inspectionQualityScore: driver.inspectionQualityScore,
        inspectionsThisMonth: 12,
        alertsCount: 2,
      },
    };
  }
}
