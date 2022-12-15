import express, { Express, Request, Response } from 'express';
import { flowRoute, teamRoute } from './routes';
import cors from 'cors';
import BodyParser from 'body-parser';
import path from 'path';

export const createApp = () => {
    const app: Express = express();
    app.use(cors());
    console.log(path.join(__dirname, 'public'));
    app.use(express.static(path.join(__dirname, 'public')))
    app.use(BodyParser.urlencoded({ extended: false }));
    app.use(BodyParser.json());

    app.use('/api/v1/flows', flowRoute);
    app.use('/api/v1/teams', teamRoute);
    app.use('/', (req: Request, res: Response) => {
        res.sendFile('index.html')
    });
   
    return app;
}