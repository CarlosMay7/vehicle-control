import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Invitation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column({ nullable: true })
  expiresAt: Date;

  @ManyToOne(() => User, (user) => user.createdInvitations)
  creator: User;
}