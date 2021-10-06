import cron from "node-cron";
import {RecurringTask} from "./entites/RecurringTask";
import {getConnection} from "typeorm";
import {MetadataKeys, Modes} from "./types";
import dayjs from "dayjs";
import {Task} from "./entites/Task";

export class Cron {

    static initCron() {
        cron.schedule("* 0 21 * * *", () => {
            this.run();
        });
    }

    static async run() {
        const allRecurringTasks = [
            ...await this.getDailyRecurringTasks(),
            ...await this.getWeeklyRecurringTasks(),
            ...await this.getMonthlyRecurringTasks()
        ];

        allRecurringTasks.forEach((recurringTask) => {
            getConnection()
                .createQueryBuilder()
                .insert()
                .into(Task)
                .values([
                    {
                        title: recurringTask.title,
                        priority: recurringTask.priority,
                        description: recurringTask.description,
                        scheduledAt: new Date(),
                        recurringTaskId: recurringTask.id
                    }
                ])
                .execute();
        });

    }

    private static async readyForNewTask(recurringTaskId: number, timePeriod: 'day' | 'week' | 'month', n?: number): Promise<boolean> {
        if (!n || n === 1) {
            return true;
        }

        const mostRecentTask = await Task.findOne({
            where: {
                recurringTaskId: recurringTaskId
            },
            order: {
                createdAt: 'DESC',
            }
        });

        if (!mostRecentTask) {
            return true;
        }

        return dayjs(mostRecentTask.createdAt)
            .tz('America/Los_Angeles')
            .add(n, timePeriod)
            .subtract(1, 'hour')
            .toDate()
            .getTime() <= dayjs().tz('America/Los_Angeles').toDate().getTime();
    }

    private static async getDailyRecurringTasks(): Promise<RecurringTask[]> {
        const recurringTasks = await getConnection()
            .getRepository(RecurringTask)
            .createQueryBuilder("recurring_task")
            .where("recurring_task.mode = :mode", {mode: Modes.DAILY})
            .getMany();

        const returningRecurringTasks = [];
        for (let recurringTask of recurringTasks) {
            if (await this.readyForNewTask(recurringTask.id, 'day', recurringTask.taskMetadata.everyNDays)) {
                returningRecurringTasks.push(recurringTask);
            }
        }

        return returningRecurringTasks;
    }

    private static async getWeeklyRecurringTasks(): Promise<RecurringTask[]> {
        const dayOfWeek = dayjs().format("d");

        const recurringTasks = await getConnection()
            .getRepository(RecurringTask)
            .createQueryBuilder("recurring_task")
            .where("recurring_task.mode = :mode", {mode: Modes.WEEKLY})
            .andWhere(`(task_metadata->>'${MetadataKeys.WEEKLY}')::jsonb @> :day`, {day: dayOfWeek})
            .getMany();

        const returningRecurringTasks = [];
        for (let recurringTask of recurringTasks) {
            if (await this.readyForNewTask(recurringTask.id, 'week', recurringTask.taskMetadata.everyNWeeks)) {
                returningRecurringTasks.push(recurringTask);
            }
        }

        return returningRecurringTasks;
    }

    private static async getMonthlyRecurringTasks(): Promise<RecurringTask[]> {
        const dayOfMonth = dayjs().format("D");

        const recurringTasks = await getConnection()
            .getRepository(RecurringTask)
            .createQueryBuilder("recurring_task")
            .where("recurring_task.mode = :mode", {mode: Modes.MONTHLY})
            .andWhere(`(task_metadata->>'${MetadataKeys.MONTHLY}')::jsonb @> :day`, {day: dayOfMonth})
            .getMany();

        const returningRecurringTasks = [];
        for (let recurringTask of recurringTasks) {
            if (await this.readyForNewTask(recurringTask.id, 'month', recurringTask.taskMetadata.everyNMonths)) {
                returningRecurringTasks.push(recurringTask);
            }
        }

        return returningRecurringTasks;
    }
}
