import {Controller} from './controller';
import express from "express";
import {getConnection} from "typeorm";
import {Task} from "../entites/Task";
import dayjs from "dayjs";
import {RecurringTask} from "../entites/RecurringTask";

export class RecurringTasksController extends Controller {
    path: string = '/recurring-tasks';

    initializeRoutes() {
        this.router.get(this.path, this.index);
        this.router.post(this.path, this.store);
        // this.router.patch(`${this.path}/:taskId`, this.update);
    }

    index = async (request: express.Request, response: express.Response) => {
        const recurringTasks = await getConnection()
            .getRepository(RecurringTask)
            .createQueryBuilder('recurring_task')
            .getMany();

        response.json(recurringTasks);
    }

    store = async (request: express.Request, response: express.Response) => {
        const result = await getConnection()
            .createQueryBuilder()
            .insert()
            .into(RecurringTask)
            .values([
                {
                    title: request.body.title,
                    priority: request.body.priority,
                    mode: request.body.mode,
                    description: request.body.description ?? null,
                    taskMetadata: request.body.taskMetadata ?? null
                }
            ])
            .returning('*')
            .execute();

        const newTask = result.generatedMaps[0];

        response.json(newTask);
    }

    update = async (request: express.Request, response: express.Response) => {
        const result = await getConnection()
            .createQueryBuilder()
            .update(Task)
            .set(request.body)
            .where("id = :id", {id: request.params.taskId})
            .returning('*')
            .execute();

        const task = await Task.findOne(request.params.taskId);

        response.json(task);
    }
}
