import { Assignment, AssignmentHistory } from 'src/assignments/entities';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, OneToOne, OneToMany} from 'typeorm';
@Entity()
export class Vehicle {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    brand: string;
  
    @Column()
    model: string;
  
    @Column({ unique: true, length: 17 })
    vin: string;
  
    @Column({ unique: true })
    licensePlate: string;
  
    @Column()
    purchaseDate: Date;
  
    @Column('decimal', { precision: 10, scale: 2 })
    cost: number;
  
    @Column({ nullable: true })
    photo: string;
  
    @CreateDateColumn()
    entryDate: Date;
  
    @Column({ default: false })
    assigned: boolean;

    // Soft delete
    @DeleteDateColumn()
    deletedAt: Date;

    @OneToOne(() => Assignment, assignment => assignment.vehicle)
    assignment: Assignment;

    @OneToMany(() => AssignmentHistory, assignmentHistory => assignmentHistory.vehicle)
    assignmentHistory: AssignmentHistory[];
}
