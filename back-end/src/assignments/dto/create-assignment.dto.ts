import { IsDateString, IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class CreateAssignmentDto {
    @IsUUID()
    @IsNotEmpty()
    vehicleId: string;

    @IsUUID()
    @IsNotEmpty()
    driverId: string;

    @IsOptional()
    @IsDateString()
    assignmentDate?: Date;
}
