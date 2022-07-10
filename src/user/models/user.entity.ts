import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";


export enum UserRole {
    ADMIN = "admin",
    USER = "user",
    EDITOR = "editor"
}

@Entity()
export class UserEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({unique: true})
    username: string;

    @Column()
    email: string;

  
    @Column()
    password: string;
    
    @Column({type: 'enum', enum: UserRole, default: UserRole.USER})
    role: UserRole;



    @BeforeInsert()
    emailToLowercase(){
        this.email = this.email.toLowerCase(); 
    }
}