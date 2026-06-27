import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Driver } from '@database/entities';
import { DriversController } from './drivers.controller';
import { DriversService } from './drivers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Driver])],
  controllers: [DriversController],
  providers: [
    DriversService,
    {
      provide: 'DRIVER_REPOSITORY',
      useFactory: (dataSource) => dataSource.getRepository(Driver),
      inject: ['DATA_SOURCE'],
    },
  ],
  exports: [DriversService],
})
export class DriversModule {}
