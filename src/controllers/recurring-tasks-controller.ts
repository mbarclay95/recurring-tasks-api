import {Controller} from './controller';
import express from "express";
import {getConnection} from "typeorm";
import {RecurringTask} from "../entites/RecurringTask";

export class RecurringTasksController extends Controller {
    path: string = '/recurring-tasks';

    initializeRoutes() {
        this.router.get(this.path, this.index);
        this.router.post(this.path, this.store);
        this.router.patch(`${this.path}/:recurringTaskId`, this.update);
        this.router.delete(`${this.path}/:recurringTaskId`, this.destroy);
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
        await getConnection()
            .createQueryBuilder()
            .update(RecurringTask)
            .set(request.body)
            .where("id = :id", {id: request.params.recurringTaskId})
            .execute();

        const recurringTask = await RecurringTask.findOne(request.params.recurringTaskId);

        response.json(recurringTask);
    }

    destroy = async (request: express.Request, response: express.Response) => {
        await getConnection()
            .getRepository(RecurringTask)
            .createQueryBuilder()
            .where("id = :id", {id: request.params.recurringTaskId})
            .softDelete()
            .execute();

        response.json({success: true});
    }
}
