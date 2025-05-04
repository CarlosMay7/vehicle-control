import { Injectable } from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Driver } from './entities';
import { Repository } from 'typeorm';
import { ExceptionService } from 'src/common/exception.service';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
    private readonly exceptionService: ExceptionService
  ){}
  
  async create(createDriverDto: CreateDriverDto) {
    try {
      const driver = this.driverRepository.create(createDriverDto);
      await this.driverRepository.save(driver);
      
      return driver;
    } catch (error) {
      this.exceptionService.handleDBExceptions(error);
    }
  }

  findAll() {
    try {
      return this.driverRepository.find();
    } catch (error) {
      this.exceptionService.handleDBExceptions(error);
    }
  }

  async findOne(id: string) {
    const driver = await this.driverRepository.findOneBy({ id });
    if(!driver) this.exceptionService.throwNotFound("Driver", id);

    return driver; 
  }

  async update(id: string, updateDriverDto: UpdateDriverDto) {
    const driver = await this.driverRepository.preload({
      id,
      ...updateDriverDto,
      });
      
      if (!driver) this.exceptionService.throwNotFound("Driver", id);
      
      try {
        return await this.driverRepository.save(driver);
      } catch (error) {
        this.exceptionService.handleDBExceptions(error);
      }
  }

  async remove(id: string) {
    const driver = await this.findOne(id);
    await this.driverRepository.remove(driver);
  }
}
