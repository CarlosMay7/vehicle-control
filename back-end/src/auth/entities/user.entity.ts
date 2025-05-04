import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Invitation } from "./invitation.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column('text')
    fullName : string;

    @Column('text', { unique: true })
    email : string;

    @Column('text', { select: false })
    password : string;

    @OneToMany(() => Invitation, (invitation) => invitation.creator)
    createdInvitations: Invitation[];
}
