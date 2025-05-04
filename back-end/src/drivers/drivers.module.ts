import { Module } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';
import { Driver } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';
import { Assignment } from 'src/assignments/entities';

@Module({
  controllers: [DriversController],
  providers: [DriversService],
  imports: [
    TypeOrmModule.forFeature([ Driver, Assignment ]),
    CommonModule,
    AuthModule
  ],
})
export class DriversModule {}
