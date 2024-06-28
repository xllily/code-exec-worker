import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Job {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    code: string;

    @Column({ default: 'pending' })
    status: string;

    @Column({ nullable: true })
    result: string;

    @BeforeInsert()
    generateId() {
        this.id = uuidv4();
    }
}
