import { Assignment, AssignmentHistory } from 'src/assignments/entities';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, OneToOne, OneToMany } from 'typeorm';

@Entity()
export class Driver {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column()
  birthdate: Date;

  @Column({ unique: true, length: 18 })
  curp: string;

  @Column()
  address: string;

  @Column('decimal', { precision: 10, scale: 2 })
  monthlySalary: number;

  @Column({ unique: true })
  licenseNumber: string;

  @CreateDateColumn()
  entryDate: Date;

  @Column({ default: false })
  assigned: boolean;

  // Soft delete
  @DeleteDateColumn()
  deletedAt: Date;

  @OneToOne(() => Assignment, assignment => assignment.driver)
  assignment: Assignment;

  @OneToMany(() => AssignmentHistory, assignmentHistory => assignmentHistory.driver)
  assignmentHistory: AssignmentHistory[];
}
