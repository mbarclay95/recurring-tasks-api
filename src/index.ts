import "reflect-metadata";
import {Server} from "./server";
import {Database} from "./database";
import {Cron} from "./cron";
import {Timezone} from "./timezone";

const main = async () => {
    await Database.initConnection();
    // Cron.run();
    Timezone.initTimezone();

    const server = new Server();
    server.listen();
}

main().catch(err => {
    console.log(err);
});


