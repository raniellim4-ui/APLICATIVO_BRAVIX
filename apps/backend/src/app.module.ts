import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { DriversModule } from './modules/drivers/drivers.module';
import { InspectionsModule } from './modules/inspections/inspections.module';
import { MaintenanceModule } from './modules/maintenance/maintenance.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { HealthModule } from './modules/health/health.module';
import { RolesGuard } from './common/guards/roles.guard';
import {
  User,
  Vehicle,
  Driver,
  Inspection,
  MaintenanceSchedule,
} from './database/entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'vehicle_inspection_dev',
      entities: [User, Vehicle, Driver, Inspection, MaintenanceSchedule],
      migrations: ['dist/database/migrations/*.js'],
      migrationsRun: true,
      synchronize: false,
      logging: process.env.DB_LOGGING === 'true',
    }),
    DatabaseModule,
    AuthModule,
    VehiclesModule,
    DriversModule,
    InspectionsModule,
    MaintenanceModule,
    AnalyticsModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
