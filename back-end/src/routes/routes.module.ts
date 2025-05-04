import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { Assignment, AssignmentHistory } from 'src/assignments/entities';
import { Route } from './entities';
import { CommonModule } from 'src/common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AssignmentsService } from 'src/assignments/assignments.service';
import { DriversService } from 'src/drivers/drivers.service';
import { Vehicle } from 'src/vehicles/entities';
import { Driver } from 'src/drivers/entities';
import { VehiclesService } from 'src/vehicles/vehicles.service';

@Module({
  controllers: [RoutesController],
  providers: [RoutesService, AssignmentsService, DriversService, VehiclesService],
  imports: [
    TypeOrmModule.forFeature([ Assignment, AssignmentHistory, Vehicle, Route, Driver ]),
    CommonModule,
    AuthModule
  ],
})
export class RoutesModule {}
