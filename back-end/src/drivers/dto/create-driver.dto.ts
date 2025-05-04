import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator";

export class CreateDriverDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 100)
  fullName: string;

  @IsDateString()
  @IsNotEmpty()
  birthdate: Date;

  @IsString()
  @IsNotEmpty()
  @Length(18, 18) // CURP has 18 characters
  curp: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 200)
  address: string;

  @IsNumber()
  monthlySalary: number;

  @IsString()
  @IsNotEmpty()
  @Length(5, 20)
  licenseNumber: string;

  @IsDateString()
  entryDate: Date;

  @IsBoolean()
  @IsOptional()
  assigned?: boolean;
}
