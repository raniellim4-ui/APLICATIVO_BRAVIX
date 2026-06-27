import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('drivers')
@UseGuards(JwtAuthGuard)
export class DriversController {
  constructor(private driversService: DriversService) {}

  @Get()
  async findAll() {
    return this.driversService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.driversService.findOne(id);
  }

  @Post()
  async create(@Body() createDriverDto: any) {
    return this.driversService.create(createDriverDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDriverDto: any) {
    return this.driversService.update(id, updateDriverDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.driversService.remove(id);
  }

  @Get(':id/dashboard')
  async getDashboard(@Param('id') id: string) {
    return this.driversService.getDashboard(id);
  }
}
