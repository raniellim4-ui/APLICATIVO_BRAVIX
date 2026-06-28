import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInspectionPhotos1719600000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "inspections" ADD COLUMN IF NOT EXISTS "photos" jsonb DEFAULT '[]';`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "inspections" DROP COLUMN IF EXISTS "photos";`,
    );
  }
}
