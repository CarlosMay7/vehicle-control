import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesModule } from './vehicles/vehicles.module';
import { CommonModule } from './common/common.module';
import { DriversModule } from './drivers/drivers.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { RoutesModule } from './routes/routes.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.SUPABASE_DB_URL,    
      autoLoadEntities: true,
      synchronize: true,
      ssl: { rejectUnauthorized: false },
    }),
    VehiclesModule,
    CommonModule,
    DriversModule,
    AssignmentsModule,
    RoutesModule,
    AuthModule,
  ],
})
export class AppModule {}
