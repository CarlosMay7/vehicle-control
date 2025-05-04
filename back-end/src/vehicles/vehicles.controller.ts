import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.vehiclesService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.vehiclesService.remove(id);
  }
}
