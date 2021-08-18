import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import {Controller} from "./controllers/controller";
import {TasksController} from "./controllers/tasks-controller";
import {RecurringTasksController} from "./controllers/recurring-tasks-controller";
import {PORT} from "./env";

export class Server {
    app: express.Application;
    port: number = PORT;

    constructor() {
        this.app = express();

        this.initializeMiddlewares();
        this.initializeControllers();
    }

    private initializeMiddlewares() {
        this.app.use(cors());
        this.app.use(bodyParser.json());
    }

    private initializeControllers() {
        const controllers: Controller[] = [
            new TasksController(),
            new RecurringTasksController()
        ];
        controllers.forEach((controller) => {
            controller.initializeRoutes();
            this.app.use('/api', controller.router);
        });
    }

    listen() {
        this.app.listen(this.port);
    }
}
