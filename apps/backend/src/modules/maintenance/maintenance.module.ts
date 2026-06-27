import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaintenanceSchedule } from '@database/entities';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceService } from './maintenance.service';

@Module({
  imports: [TypeOrmModule.forFeature([MaintenanceSchedule])],
  controllers: [MaintenanceController],
  providers: [
    MaintenanceService,
    {
      provide: 'MAINTENANCE_SCHEDULE_REPOSITORY',
      useFactory: (dataSource) => dataSource.getRepository(MaintenanceSchedule),
      inject: ['DATA_SOURCE'],
    },
  ],
  exports: [MaintenanceService],
})
export class MaintenanceModule {}
