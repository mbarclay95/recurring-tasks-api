import {ObjectType} from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn, DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Task} from "./Task";

@ObjectType()
@Entity()
export class RecurringTask extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt?: Date;

    @Column()
    title!: string;

    @Column()
    mode!: string;

    @Column({nullable: true})
    description?: string;

    @Column()
    priority!: number;

    @Column({nullable: true, type: 'jsonb', array: false})
    taskMetadata!: {
        weekdays?: number[],
        monthDays?: number[],
        yearDays?: Date[],
        everyNDays?: number;
        everyNWeeks?: number;
        everyNMonths?: number;
    };

    @OneToMany(() => Task, task => task.recurringTask)
    tasks: Task[];
}
