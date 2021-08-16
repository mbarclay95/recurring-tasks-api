import cron from "node-cron";
import {RecurringTask} from "./entites/RecurringTask";
import {getConnection} from "typeorm";
import {MetadataKeys, Modes} from "./types";
import dayjs from "dayjs";
import {Task} from "./entites/Task";

export class Cron {

    static initCron() {
        cron.schedule("* * 4 * * *", () => {
            this.run();
        });
    }

    static async run() {
        const allRecurringTasks = [
            ...await this.getDailyRecurringTasks(),
            ...await this.getWeeklyRecurringTasks(),
            ...await this.getMonthlyRecurringTasks()
        ];

        console.log(allRecurringTasks);

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

    private static async getDailyRecurringTasks(): Promise<RecurringTask[]> {
        return await getConnection()
            .getRepository(RecurringTask)
            .createQueryBuilder("recurring_task")
            .where("recurring_task.mode = :mode", {mode: Modes.DAILY})
            .getMany();
    }

    private static async getWeeklyRecurringTasks(): Promise<RecurringTask[]> {
        const dayOfWeek = dayjs().format("d");

        return await getConnection()
            .getRepository(RecurringTask)
            .createQueryBuilder("recurring_task")
            .where("recurring_task.mode = :mode", {mode: Modes.WEEKLY})
            .andWhere(`(task_metadata->>'${MetadataKeys.WEEKLY}')::jsonb @> :day`, {day: dayOfWeek})
            .getMany();
    }

    private static async getMonthlyRecurringTasks(): Promise<RecurringTask[]> {
        const dayOfMonth = dayjs().format("D");

        return await getConnection()
            .getRepository(RecurringTask)
            .createQueryBuilder("recurring_task")
            .where("recurring_task.mode = :mode", {mode: Modes.MONTHLY})
            .andWhere(`(task_metadata->>'${MetadataKeys.MONTHLY}')::jsonb @> :day`, {day: dayOfMonth})
            .getMany();
    }
}
