import {createConnection} from "typeorm";
import {Task} from "./entites/Task";
import {RecurringTask} from "./entites/RecurringTask";
import {SnakeNamingStrategy} from "typeorm-naming-strategies";
import {DB_HOST, DB_PASSWORD, DB_USER} from "../env";

export class Database {

    static async initConnection() {
        const connection = await createConnection({
            type: 'postgres',
            host: DB_HOST,
            database: 'recurring_tasks_node',
            username: DB_USER,
            password: DB_PASSWORD,
            logging: false,
            synchronize: false,
            entities: [Task, RecurringTask],
            namingStrategy: new SnakeNamingStrategy(),
        });
    }
}
