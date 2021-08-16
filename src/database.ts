import {createConnection} from "typeorm";
import {Task} from "./entites/Task";
import {RecurringTask} from "./entites/RecurringTask";
import {SnakeNamingStrategy} from "typeorm-naming-strategies";

export class Database {

    static async initConnection() {
        const connection = await createConnection({
            type: 'postgres',
            host: '192.168.0.41',
            database: 'recurring_tasks_node',
            username: 'mbarclay36',
            password: 'secret',
            logging: false,
            synchronize: false,
            entities: [Task, RecurringTask],
            namingStrategy: new SnakeNamingStrategy(),
        });
    }
}
