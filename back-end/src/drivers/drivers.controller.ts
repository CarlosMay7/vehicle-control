import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createDriverDto: CreateDriverDto) {
    return this.driversService.create(createDriverDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.driversService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.driversService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateDriverDto: UpdateDriverDto) {
    return this.driversService.update(id, updateDriverDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.driversService.remove(id);
  }
}
