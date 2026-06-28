import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { InspectionsService } from './inspections.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('inspections')
@UseGuards(JwtAuthGuard)
export class InspectionsController {
  constructor(private inspectionsService: InspectionsService) {}

  @Get()
  findAll() {
    return this.inspectionsService.findAll();
  }

  @Get('vehicle/:vehicleId')
  findByVehicle(@Param('vehicleId') vehicleId: string) {
    return this.inspectionsService.findByVehicle(vehicleId);
  }

  @Get('driver/:driverId')
  findByDriver(@Param('driverId') driverId: string) {
    return this.inspectionsService.findByDriver(driverId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inspectionsService.findOne(id);
  }

  @Post()
  create(@Body() createInspectionDto: any, @Request() req: any) {
    return this.inspectionsService.create(createInspectionDto, req.user.sub);
  }

  @Post(':id/photos')
  addPhotos(@Param('id') id: string, @Body() photosDto: any) {
    return this.inspectionsService.addPhotos(id, photosDto);
  }

  @Post(':id/signature')
  addSignature(@Param('id') id: string, @Body() signatureDto: any) {
    return this.inspectionsService.addSignature(id, signatureDto);
  }

  @Post(':id/submit')
  submitInspection(@Param('id') id: string) {
    return this.inspectionsService.submitInspection(id);
  }
}
