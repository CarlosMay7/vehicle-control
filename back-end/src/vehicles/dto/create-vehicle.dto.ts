import { IsString, IsDateString, IsNumber, IsOptional, Length, IsBoolean } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsString()
  @Length(17, 17, { message: 'VIN must be exactly 17 characters long' })
  vin: string;

  @IsString()
  licensePlate: string;

  @IsDateString()
  purchaseDate: Date;

  @IsNumber()
  cost: number;

  @IsString()
  @IsOptional()
  photo?: string;

  @IsDateString()
  entryDate: Date;

  @IsBoolean()
  @IsOptional()
  assigned?: boolean;
}
