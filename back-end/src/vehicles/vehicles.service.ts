import { Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from './entities';
import { Repository } from 'typeorm';
import { ExceptionService } from 'src/common/exception.service';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    private readonly exceptionService: ExceptionService
  ){}
  
  async create(createVehicleDto: CreateVehicleDto) {
    try {
      const vehicle = this.vehicleRepository.create(createVehicleDto);
      await this.vehicleRepository.save(vehicle);
      
      return vehicle;
    } catch (error) {
      this.exceptionService.handleDBExceptions(error);
    }
  }

  async findAll() {
    try {
      return this.vehicleRepository.find();
    } catch (error) {
      this.exceptionService.handleDBExceptions(error)
    }
  }

  async findOne(id : string) {
    const vehicle = await this.vehicleRepository.findOneBy({ id });
    if(!vehicle) this.exceptionService.throwNotFound('Vehicle', id)

    return vehicle; 
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    const vehicle = await this.vehicleRepository.preload({
      id,
      ...updateVehicleDto,
    });

    if (!vehicle) this.exceptionService.throwNotFound("Vehicle", id);

    try {
      return await this.vehicleRepository.save(vehicle);
    } catch (error) {
      this.exceptionService.handleDBExceptions(error);
    }
  }  

  async remove(id: string) {
    const vehicle = await this.findOne(id);
    await this.vehicleRepository.remove(vehicle);
  }
}
