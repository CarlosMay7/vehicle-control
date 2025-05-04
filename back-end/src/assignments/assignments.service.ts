import { Injectable } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { Assignment, AssignmentHistory } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { VehiclesService } from 'src/vehicles/vehicles.service';
import { DriversService } from 'src/drivers/drivers.service';
import { ExceptionService } from 'src/common/exception.service';
import { Driver } from 'src/drivers/entities';
import { Vehicle } from 'src/vehicles/entities';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private readonly assignmentRepository : Repository<Assignment>,
    @InjectRepository(AssignmentHistory)
    private readonly assignmentHistoryRepository : Repository<AssignmentHistory>,
    private readonly dataSource : DataSource,

    private readonly driverService : DriversService,
    private readonly vehicleService : VehiclesService,
    private readonly exceptionService: ExceptionService
  ){}
  
  async create(createAssignmentDto: CreateAssignmentDto) {
    const { vehicleId, driverId } = createAssignmentDto;

    const assignedDriver = await this.driverService.findOne(driverId);
    if (assignedDriver.assigned) 
      this.exceptionService.throwConflictException("Driver", assignedDriver.id);
    
    
    const assignedVehicle = await this.vehicleService.findOne(vehicleId);
    if (assignedVehicle.assigned) 
      this.exceptionService.throwConflictException("Vehicle", assignedVehicle.id);
    

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const assignment = this.assignmentRepository.create({
        driver: assignedDriver,
        vehicle: assignedVehicle
      });
      await queryRunner.manager.save(assignment)
      
      assignedDriver.assigned = true;
      await queryRunner.manager.save(Driver, assignedDriver);

      assignedVehicle.assigned = true;
      await queryRunner.manager.save(Vehicle, assignedVehicle);

      const assignmentHistory = this.assignmentHistoryRepository.create(
        {
          driver: assignedDriver,
          vehicle: assignedVehicle
        }
      )
      await queryRunner.manager.save(AssignmentHistory, assignmentHistory);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      
      return assignment;
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.exceptionService.handleDBExceptions(error);
    }
  }

  async findAll() {
    try {
      return this.assignmentRepository.find({
         relations: ['vehicle', 'driver'],
      });
    } catch (error) {
      this.exceptionService.handleDBExceptions(error)
    }
  }

  async findOne(id : string) {
    const assignment = await this.assignmentRepository.findOne({
      where: { id },
      relations: ['driver', 'vehicle']
    });
    if(!assignment) this.exceptionService.throwNotFound('Assignment', id)

    return assignment; 
  }

  async update(id: string, updateAssignmentDto: UpdateAssignmentDto) {
    const { vehicleId, driverId, assignmentDate } = updateAssignmentDto;

    // Find existing assignment
    const existingAssignment = await this.findOne(id);

    // Check if the driver is being changed
    if (driverId && driverId !== existingAssignment.driver.id) {
      const newDriver = await this.driverService.findOne(driverId);
      if (newDriver.assigned) {
        this.exceptionService.throwConflictException("Driver", newDriver.id);
      }
    }

    // Check if the vehicle is being changed
    if (vehicleId && vehicleId !== existingAssignment.vehicle.id) {
      const newVehicle = await this.vehicleService.findOne(vehicleId);
      if (newVehicle.assigned) {
        this.exceptionService.throwConflictException("Vehicle", newVehicle.id);
      }
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Update the status of the previous resources
      if (driverId && driverId !== existingAssignment.driver.id) {
        existingAssignment.driver.assigned = false;
        await queryRunner.manager.save(Driver, existingAssignment.driver);
      }
      
      if (vehicleId && vehicleId !== existingAssignment.vehicle.id) {
        existingAssignment.vehicle.assigned = false;
        await queryRunner.manager.save(Vehicle, existingAssignment.vehicle);
      }

      // Get the new resources if they changed
      const newDriver = driverId ? await this.driverService.findOne(driverId) : existingAssignment.driver;
      const newVehicle = vehicleId ? await this.vehicleService.findOne(vehicleId) : existingAssignment.vehicle;

      // Update statuses of new resources
      if (driverId && driverId !== existingAssignment.driver.id) {
        newDriver.assigned = true;
        await queryRunner.manager.save(Driver, newDriver);
      }
    
      if (vehicleId && vehicleId !== existingAssignment.vehicle.id) {
        newVehicle.assigned = true;
        await queryRunner.manager.save(Vehicle, newVehicle);
      }

      // Update the assignment
      existingAssignment.driver = newDriver;
      existingAssignment.vehicle = newVehicle;
      if (assignmentDate) {
        existingAssignment.assignmentDate = assignmentDate;
      }
      await queryRunner.manager.save(existingAssignment);

      // Record in history
      const assignmentHistory = this.assignmentHistoryRepository.create({
        driver: newDriver,
        vehicle: newVehicle
      });
      await queryRunner.manager.save(AssignmentHistory, assignmentHistory);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return existingAssignment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.exceptionService.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const assignment = await this.findOne(id);
    if(!assignment) this.exceptionService.throwNotFound('Assignment', id)

    const driver = await this.driverService.findOne(assignment.driver.id);

    if(!assignment) this.exceptionService.throwNotFound('Diver', assignment.driver.id)

    const vehicle = await this.vehicleService.findOne(assignment.vehicle.id);

    if(!assignment) this.exceptionService.throwNotFound('Vehicle', assignment.vehicle.id)

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      //Change the "assigned" value of the related driver and vehicle
      driver.assigned = false;
      await queryRunner.manager.save(Driver, driver);
      vehicle.assigned = false;
      await queryRunner.manager.save(Vehicle, vehicle);

      await this.assignmentRepository.remove(assignment);

      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.exceptionService.handleDBExceptions(error);
    }
    
  }
}
