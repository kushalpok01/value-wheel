import { Entity, Column, PrimaryGeneratedColumn, AfterInsert, AfterUpdate, AfterRemove, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Report } from 'src/reports/reports.entity';

@Entity()

export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    @Exclude()
    password: string;



    @Column({ default: false })
    admin: boolean;


    @OneToMany(() => Report, (report) => report.user)
    reports: Report[];


    @AfterInsert()
    logInsert() {
        console.log("inserted user with id", this.id)
    }
    @AfterUpdate()
    logUpdate() {
        console.log("updated user with id", this.id)
    }
    @AfterRemove()
    logRemove() {
        console.log("removed user with id", this.id)
    }
}