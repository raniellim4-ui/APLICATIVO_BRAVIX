import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('maintenance_schedules')
@Index('idx_vehicle_due', ['vehicleId', 'nextDueKm'])
export class MaintenanceSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  vehicleId: string;

  @Column({ type: 'varchar', length: 100 })
  maintenanceType: string;

  @Column({ type: 'varchar', length: 100 })
  component: string;

  @Column({ type: 'integer' })
  recommendedKm: number;

  @Column({ type: 'integer', nullable: true })
  recommendedHours: number;

  @Column({ type: 'integer', nullable: true })
  lastPerformedKm: number;

  @Column({ type: 'date', nullable: true })
  lastPerformedDate: Date;

  @Column({ type: 'integer' })
  nextDueKm: number;

  @Column({ type: 'date', nullable: true })
  nextDueDate: Date;

  @Column({ type: 'integer' })
  alertThresholdKm: number;

  @Column({ type: 'boolean', default: false })
  alertSent: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
