import express, {Router} from "express";

export class Controller {
    path: string = '/';
    router: Router = express.Router();

    initializeRoutes() {
    }
}
