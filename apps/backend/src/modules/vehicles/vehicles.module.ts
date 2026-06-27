import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from '@database/entities';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle])],
  controllers: [VehiclesController],
  providers: [
    VehiclesService,
    {
      provide: 'VEHICLE_REPOSITORY',
      useFactory: (dataSource) => dataSource.getRepository(Vehicle),
      inject: ['DATA_SOURCE'],
    },
  ],
  exports: [VehiclesService],
})
export class VehiclesModule {}
