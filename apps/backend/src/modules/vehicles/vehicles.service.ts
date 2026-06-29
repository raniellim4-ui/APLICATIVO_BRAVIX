import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Vehicle } from '@database/entities';

@Injectable()
export class VehiclesService {
  constructor(
    @Inject('VEHICLE_REPOSITORY')
    private vehicleRepository: Repository<Vehicle>,
  ) {}

  async findAll() {
    const vehicles = await this.vehicleRepository.find();
    return {
      total: vehicles.length,
      vehicles,
    };
  }

  async findOne(id: string) {
    const vehicle = await this.vehicleRepository.findOne({ where: { id } });
    if (!vehicle) {
      throw new NotFoundException(`Veículo com ID ${id} não encontrado`);
    }
    return vehicle;
  }

  async create(createVehicleDto: any) {
    const vehicle = this.vehicleRepository.create({
      ...createVehicleDto,
      healthScore: 100,
      currentKm: 0,
    });
    return await this.vehicleRepository.save(vehicle);
  }

  async update(id: string, updateVehicleDto: any) {
    const vehicle = await this.findOne(id);
    const updated = { ...vehicle, ...updateVehicleDto };
    return await this.vehicleRepository.save(updated);
  }

  async remove(id: string) {
    const vehicle = await this.findOne(id);
    await this.vehicleRepository.remove(vehicle);
    return { message: 'Veículo excluído com sucesso', vehicle };
  }
}
