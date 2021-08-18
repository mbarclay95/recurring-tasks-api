import "reflect-metadata";
import {Server} from "./server";
import {Database} from "./database";
import {Timezone} from "./timezone";
import {Cron} from "./cron";

const main = async () => {
    await Database.initConnection();
    Cron.initCron();
    Timezone.initTimezone();

    const server = new Server();
    server.listen();
}

main().catch(err => {
    console.log(err);
});


