import { Driver } from 'src/drivers/entities';
import { Route } from 'src/routes/entities';
import { Vehicle } from 'src/vehicles/entities';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Driver, driver => driver.assignment)
  @JoinColumn()
  driver: Driver;
  
  @OneToOne(() => Vehicle, vehicle => vehicle.assignment)
  @JoinColumn()
  vehicle: Vehicle;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  assignmentDate: Date;

  @OneToMany(() => Route, route => route.assignment)
  routes: Route[];
}
