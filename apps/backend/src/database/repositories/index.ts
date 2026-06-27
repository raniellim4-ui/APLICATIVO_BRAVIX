import { DataSource } from 'typeorm';
import {
  User,
  Vehicle,
  Driver,
  Inspection,
  MaintenanceSchedule,
} from '../entities';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useValue: DataSource,
  },
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'VEHICLE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Vehicle),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'DRIVER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Driver),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'INSPECTION_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Inspection),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'MAINTENANCE_SCHEDULE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(MaintenanceSchedule),
    inject: ['DATA_SOURCE'],
  },
];
