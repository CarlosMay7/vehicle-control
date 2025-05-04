import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';
import { Assignment } from 'src/assignments/entities';

@Module({
  controllers: [VehiclesController],
  providers: [VehiclesService],
  imports: [
    TypeOrmModule.forFeature([ Vehicle, Assignment ]),
    CommonModule,
    AuthModule
  ],
})
export class VehiclesModule {}
