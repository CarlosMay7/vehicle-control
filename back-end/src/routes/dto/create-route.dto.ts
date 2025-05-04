import { Type } from "class-transformer";
import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from "class-validator";

export class CreateRouteDto {
  @IsUUID()
  @IsNotEmpty()
  assignmentId: string;

  @IsString()
  @MaxLength(100)
  name: string;

  @IsNumber({ maxDecimalPlaces: 8 })
  @Type(() => Number)
  @Min(-90)
  @Max(90)
  startLatitude: number;

  @IsNumber({ maxDecimalPlaces: 8 })
  @Type(() => Number)
  @Min(-180)
  @Max(180)
  startLongitude: number;

  @IsNumber({ maxDecimalPlaces: 8 })
  @Type(() => Number)
  @Min(-90)
  @Max(90)
  destinationLatitude: number;

  @IsNumber({ maxDecimalPlaces: 8 })
  @Type(() => Number)
  @Min(-180)
  @Max(180)
  destinationLongitude: number;

  @IsBoolean()
  successful: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  issueDescription?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  comments?: string;

  @IsDateString()
  routeDate: Date;
}
