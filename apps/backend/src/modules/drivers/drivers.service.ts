import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Driver } from '@database/entities';

@Injectable()
export class DriversService {
  constructor(
    @Inject('DRIVER_REPOSITORY')
    private driverRepository: Repository<Driver>,
  ) {}

  async findAll() {
    const drivers = await this.driverRepository.find();
    return {
      total: drivers.length,
      drivers,
    };
  }

  async findOne(id: string) {
    const driver = await this.driverRepository.findOne({ where: { id } });
    if (!driver) {
      throw new NotFoundException(`Driver with ID ${id} not found`);
    }
    return driver;
  }

  async create(createDriverDto: any) {
    const driver = this.driverRepository.create({
      ...createDriverDto,
      totalKm: 0,
      fuelExpense: 0,
      fuelEfficiency: 0,
      inspectionQualityScore: 5,
    });
    return await this.driverRepository.save(driver);
  }

  async update(id: string, updateDriverDto: any) {
    const driver = await this.findOne(id);
    const updated = { ...driver, ...updateDriverDto };
    return await this.driverRepository.save(updated);
  }

  async remove(id: string) {
    const driver = await this.findOne(id);
    await this.driverRepository.remove(driver);
    return { message: 'Driver deleted successfully', driver };
  }

  async getDashboard(id: string) {
    const driver = await this.findOne(id);
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
