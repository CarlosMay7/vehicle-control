import { ConflictException, Injectable } from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Route } from './entities';
import { Repository } from 'typeorm';
import { ExceptionService } from 'src/common/exception.service';
import { AssignmentsService } from 'src/assignments/assignments.service';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
    private readonly assignmentsService: AssignmentsService,
    private readonly exceptionService: ExceptionService
    
  ) {}
  
  async create(createRouteDto: CreateRouteDto) {
    const { assignmentId, ...routeData } = createRouteDto;

    const assignment = await this.assignmentsService.findOne(assignmentId);

    const existingRoute = await this.routeRepository.findOne({
      where: { assignment: { id: assignmentId }, routeDate: routeData.routeDate },
    });

    if (existingRoute)
      throw new ConflictException('A route already exists for this assignment on the specified date');

    try {
      const route = this.routeRepository.create({
        ...routeData, 
        assignment 
      });
      return this.routeRepository.save(route);
    } catch (error) {
      this.exceptionService.handleDBExceptions(error);
    }
  }

  async findAll() {
    try {
      return await this.routeRepository.find({
        relations: ['assignment', 'assignment.vehicle', 'assignment.driver'],
      });
    } catch (error) {
      this.exceptionService.handleDBExceptions(error);
    };
  }

  async findOne(id : string) {
    const route = await this.routeRepository.findOne({
      where: { id },
      relations: ['assignment', 'assignment.vehicle', 'assignment.driver'],
    });
    if(!route) this.exceptionService.throwNotFound('Route', id)

    return route; 
  }

  async update(id: string, updateRouteDto: UpdateRouteDto) {

    if(updateRouteDto.assignmentId) this.assignmentsService.findOne(updateRouteDto.assignmentId);

    const route = await this.routeRepository.preload({
      id,
      ...updateRouteDto,
    });

    if (!route) this.exceptionService.throwNotFound("Route", id);

    try {
      return await this.routeRepository.save(route);
    } catch (error) {
      this.exceptionService.handleDBExceptions(error);
    }
  }  
  
  async remove(id: string) {
    const route = await this.findOne(id);
    await this.routeRepository.remove(route);
  }
}
