import { Module } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController } from './assignments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';
import { Assignment, AssignmentHistory } from './entities';
import { Driver } from 'src/drivers/entities';
import { Vehicle } from 'src/vehicles/entities';
import { DriversService } from 'src/drivers/drivers.service';
import { VehiclesService } from 'src/vehicles/vehicles.service';
import { Route } from 'src/routes/entities';

@Module({
  controllers: [AssignmentsController],
  providers: [AssignmentsService, DriversService, VehiclesService],
  imports: [
    TypeOrmModule.forFeature([ Assignment, AssignmentHistory, Vehicle, Route, Driver ]),
    CommonModule,
    AuthModule
  ],
  exports: [AssignmentsService]
})
export class AssignmentsModule {}
