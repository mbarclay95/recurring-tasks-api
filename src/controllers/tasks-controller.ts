import {Controller} from './controller';
import express from "express";
import {Brackets, getConnection} from "typeorm";
import {Task} from "../entites/Task";
import dayjs from "dayjs";

export class TasksController extends Controller {
    path: string = '/tasks';

    initializeRoutes() {
        this.router.get(this.path, this.index);
        this.router.post(this.path, this.store);
        this.router.patch(`${this.path}/:taskId`, this.update);
    }

    index = async (request: express.Request, response: express.Response) => {
        let today = dayjs().tz('America/Los_Angeles').format('YYYY-MM-DD');

        let tasks = await getConnection()
            .getRepository(Task)
            .createQueryBuilder('task')
            .where('task.scheduled_at <= :date', {date: today})
            .andWhere(new Brackets(query => {
                query.orWhere('task.completed_at IS NULL')
                    .orWhere('DATE(task.completed_at) = :today', {today: today})
            }))
            .andWhere('task.cleared_at IS NULL')
            .getMany();

        tasks = tasks.map(task => {
            task.scheduledAt = dayjs(task.scheduledAt).toDate();
            return task;
        });

        response.json(tasks);
    }

    store = async (request: express.Request, response: express.Response) => {
        const result = await getConnection()
            .createQueryBuilder()
            .insert()
            .into(Task)
            .values([
                {
                    title: request.body.title,
                    priority: request.body.priority,
                    description: request.body.description ?? null,
                    scheduledAt: request.body.scheduledAt ?? dayjs().tz('America/Los_Angeles').format('YYYY-MM-DD')
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
            .update(Task)
            .set(request.body)
            .where("id = :id", {id: request.params.taskId})
            .execute();

        const task = await Task.findOne(request.params.taskId);
        if (task) {
            task.scheduledAt = dayjs(task?.scheduledAt).toDate();
        }

        response.json(task);
    }
}
