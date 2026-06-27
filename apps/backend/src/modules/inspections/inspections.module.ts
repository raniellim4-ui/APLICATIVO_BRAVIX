import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inspection } from '@database/entities';
import { InspectionsController } from './inspections.controller';
import { InspectionsService } from './inspections.service';

@Module({
  imports: [TypeOrmModule.forFeature([Inspection])],
  controllers: [InspectionsController],
  providers: [
    InspectionsService,
    {
      provide: 'INSPECTION_REPOSITORY',
      useFactory: (dataSource) => dataSource.getRepository(Inspection),
      inject: ['DATA_SOURCE'],
    },
  ],
  exports: [InspectionsService],
})
export class InspectionsModule {}
