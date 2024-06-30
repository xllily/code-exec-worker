import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Job {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    codeFilePath: string;

    @Column()
    status: string;
}
