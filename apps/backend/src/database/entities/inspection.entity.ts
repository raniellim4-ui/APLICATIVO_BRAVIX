import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('inspections')
@Index('idx_vehicle_date', ['vehicleId', 'inspectionDate'])
@Index('idx_driver_date', ['driverId', 'inspectionDate'])
export class Inspection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  vehicleId: string;

  @Column({ type: 'uuid', nullable: true })
  driverId: string;

  @Column({ type: 'timestamp with time zone' })
  inspectionDate: Date;

  @Column({
    type: 'enum',
    enum: ['pre_trip', 'post_trip', 'periodic', 'maintenance_check'],
  })
  inspectionType: string;

  @Column({
    type: 'enum',
    enum: ['draft', 'completed', 'reviewed', 'approved'],
    default: 'draft',
  })
  status: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
  })
  aiAnalysisStatus: string;

  @Column({ type: 'point', nullable: true })
  location: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  locationCity: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  locationCountry: string;

  @Column({ type: 'integer', default: 0 })
  durationMinutes: number;

  @Column({ type: 'integer', default: 0 })
  totalPhotos: number;

  @Column({ type: 'boolean', default: false })
  video360Available: boolean;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  aiQualityScore: number;

  @Column({ type: 'integer', default: 0 })
  damageCount: number;

  @Column({ type: 'integer', default: 0 })
  newDamages: number;

  @Column({ type: 'integer', default: 0 })
  resolvedDamages: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  tachographPhotoUrl: string;

  @Column({ type: 'integer', nullable: true })
  odometerReading: number;

  @Column({ type: 'boolean', default: false })
  odometerVerified: boolean;

  @Column({ type: 'text', nullable: true })
  signatureDigital: string;

  @Column({ type: 'jsonb', default: {} })
  damageDetails: any;

  @Column({ type: 'jsonb', default: [] })
  photos: string[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
