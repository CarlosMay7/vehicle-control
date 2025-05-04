import { Driver } from "src/drivers/entities";
import { Vehicle } from "src/vehicles/entities";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AssignmentHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Driver)
  driver: Driver;

  @ManyToOne(() => Vehicle)
  vehicle: Vehicle;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  assignmentDate: Date;
}