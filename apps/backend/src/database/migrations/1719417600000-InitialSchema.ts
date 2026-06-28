import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1719417600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enum types (Postgres requires explicit enum types)
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "users_role_enum" AS ENUM ('admin','manager','driver','mechanic');
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "inspections_type_enum" AS ENUM ('pre_trip','post_trip','periodic','maintenance_check');
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "inspections_status_enum" AS ENUM ('draft','completed','reviewed','approved');
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "inspections_ai_status_enum" AS ENUM ('pending','processing','completed','failed');
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar(255) NOT NULL,
        "email" varchar(255) UNIQUE NOT NULL,
        "passwordHash" varchar(255) NOT NULL,
        "role" "users_role_enum" NOT NULL,
        "phone" varchar(20),
        "isActive" boolean DEFAULT true,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    await queryRunner.query(`CREATE INDEX "idx_users_email" ON "users" ("email");`);

    await queryRunner.query(`
      CREATE TABLE "vehicles" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "companyId" uuid NOT NULL,
        "plate" varchar(10) UNIQUE NOT NULL,
        "crlvNumber" varchar(20),
        "renavam" varchar(11),
        "model" varchar(255) NOT NULL,
        "make" varchar(255) NOT NULL,
        "year" integer NOT NULL,
        "vin" varchar(17) UNIQUE NOT NULL,
        "registrationDate" date NOT NULL,
        "lastInspectionAt" TIMESTAMP WITH TIME ZONE,
        "healthScore" decimal(5,2) DEFAULT 100,
        "currentKm" integer DEFAULT 0,
        "purchasePrice" decimal(12,2),
        "expectedLifespanYears" integer,
        "qrCodeId" varchar(500),
        "isActive" boolean DEFAULT true,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    await queryRunner.query(`CREATE INDEX "idx_vehicles_plate" ON "vehicles" ("plate");`);
    await queryRunner.query(`CREATE INDEX "idx_vehicles_company" ON "vehicles" ("companyId");`);

    await queryRunner.query(`
      CREATE TABLE "drivers" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "companyId" uuid NOT NULL,
        "name" varchar(255) NOT NULL,
        "cnh" varchar(20) UNIQUE NOT NULL,
        "cnhExpiration" date,
        "phone" varchar(20),
        "email" varchar(255),
        "totalKm" integer DEFAULT 0,
        "fuelExpense" decimal(10,2) DEFAULT 0,
        "fuelEfficiency" decimal(5,2) DEFAULT 0,
        "inspectionQualityScore" decimal(3,2) DEFAULT 5,
        "avgInspectionTimeMinutes" integer DEFAULT 0,
        "inspectionsCompleted" integer DEFAULT 0,
        "isActive" boolean DEFAULT true,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    await queryRunner.query(`CREATE INDEX "idx_drivers_company" ON "drivers" ("companyId");`);
    await queryRunner.query(`CREATE INDEX "idx_drivers_cnh" ON "drivers" ("cnh");`);

    await queryRunner.query(`
      CREATE TABLE "inspections" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "vehicleId" uuid NOT NULL,
        "driverId" uuid,
        "inspectionDate" TIMESTAMP WITH TIME ZONE NOT NULL,
        "inspectionType" "inspections_type_enum" NOT NULL,
        "status" "inspections_status_enum" DEFAULT 'draft',
        "aiAnalysisStatus" "inspections_ai_status_enum" DEFAULT 'pending',
        "location" point,
        "locationCity" varchar(100),
        "locationCountry" varchar(100),
        "durationMinutes" integer DEFAULT 0,
        "totalPhotos" integer DEFAULT 0,
        "video360Available" boolean DEFAULT false,
        "aiQualityScore" decimal(3,2) DEFAULT 0,
        "damageCount" integer DEFAULT 0,
        "newDamages" integer DEFAULT 0,
        "resolvedDamages" integer DEFAULT 0,
        "tachographPhotoUrl" varchar(500),
        "odometerReading" integer,
        "odometerVerified" boolean DEFAULT false,
        "signatureDigital" text,
        "damageDetails" jsonb DEFAULT '{}',
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    await queryRunner.query(
      `CREATE INDEX "idx_inspections_vehicle_date" ON "inspections" ("vehicleId", "inspectionDate");`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_inspections_driver_date" ON "inspections" ("driverId", "inspectionDate");`,
    );

    await queryRunner.query(`
      CREATE TABLE "maintenance_schedules" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "vehicleId" uuid NOT NULL,
        "maintenanceType" varchar(100) NOT NULL,
        "component" varchar(100) NOT NULL,
        "recommendedKm" integer NOT NULL,
        "recommendedHours" integer,
        "lastPerformedKm" integer,
        "lastPerformedDate" date,
        "nextDueKm" integer NOT NULL,
        "nextDueDate" date,
        "alertThresholdKm" integer NOT NULL,
        "alertSent" boolean DEFAULT false,
        "isActive" boolean DEFAULT true,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    await queryRunner.query(
      `CREATE INDEX "idx_maintenance_vehicle_due" ON "maintenance_schedules" ("vehicleId", "nextDueKm");`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "maintenance_schedules";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "inspections";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "drivers";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "vehicles";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users";`);

    await queryRunner.query(`DROP TYPE IF EXISTS "inspections_ai_status_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "inspections_status_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "inspections_type_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "users_role_enum";`);
  }
}
