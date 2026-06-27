import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  Index,
} from 'typeorm';

@Entity('vehicles')
@Unique(['plate'])
@Unique(['vin'])
@Index('idx_plate', ['plate'])
@Index('idx_company', ['companyId'])
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  companyId: string;

  @Column({ type: 'varchar', length: 10 })
  plate: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  crlvNumber: string;

  @Column({ type: 'varchar', length: 11, nullable: true })
  renavam: string;

  @Column({ type: 'varchar', length: 255 })
  model: string;

  @Column({ type: 'varchar', length: 255 })
  make: string;

  @Column({ type: 'integer' })
  year: number;

  @Column({ type: 'varchar', length: 17, unique: true })
  vin: string;

  @Column({ type: 'date' })
  registrationDate: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  lastInspectionAt: Date;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 100 })
  healthScore: number;

  @Column({ type: 'integer', default: 0 })
  currentKm: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  purchasePrice: number;

  @Column({ type: 'integer', nullable: true })
  expectedLifespanYears: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  qrCodeId: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
