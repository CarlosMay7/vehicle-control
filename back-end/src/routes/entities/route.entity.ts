import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Assignment } from '../../assignments/entities';

@Entity()
export class Route {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 8 })
  startLatitude: number;

  @Column('decimal', { precision: 11, scale: 8 })
  startLongitude: number;

  @Column('decimal', { precision: 10, scale: 8 })
  destinationLatitude: number;

  @Column('decimal', { precision: 11, scale: 8 })
  destinationLongitude: number;

  @Column({ default: true })
  successful: boolean;

  @Column({ nullable: true })
  issueDescription: string;

  @Column({ nullable: true })
  comments: string;

  @Column()
  routeDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Assignment, assignment => assignment.routes)
  assignment: Assignment;
}
