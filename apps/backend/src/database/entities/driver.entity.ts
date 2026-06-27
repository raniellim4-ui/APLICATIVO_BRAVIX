import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('drivers')
@Index('idx_company', ['companyId'])
@Index('idx_cnh', ['cnh'])
export class Driver {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  companyId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  cnh: string;

  @Column({ type: 'date', nullable: true })
  cnhExpiration: Date;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'integer', default: 0 })
  totalKm: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  fuelExpense: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  fuelEfficiency: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 5 })
  inspectionQualityScore: number;

  @Column({ type: 'integer', default: 0 })
  avgInspectionTimeMinutes: number;

  @Column({ type: 'integer', default: 0 })
  inspectionsCompleted: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
