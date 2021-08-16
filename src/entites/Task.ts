import {ObjectType} from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {RecurringTask} from "./RecurringTask";

@ObjectType()
@Entity()
export class Task extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    title!: string;

    @Column({nullable: true})
    description?: string;

    @Column({nullable: true})
    completedAt?: Date;

    @Column({nullable: true})
    clearedAt?: Date;

    @Column({type: 'date'})
    scheduledAt!: Date;

    @Column()
    priority!: number;

    @Column({nullable: true})
    recurringTaskId: number;

    @ManyToOne(() => RecurringTask, recurringTask => recurringTask.tasks, {nullable: true})
    recurringTask: RecurringTask | null

}
