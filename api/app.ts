import express, { Express } from 'express';
import { flowRoute, teamRoute } from './routes';
import cors from 'cors';
import BodyParser from 'body-parser';

export const createApp = () => {
    const app: Express = express();
    app.use(cors());

    app.use(BodyParser.urlencoded({ extended: false }));
    app.use(BodyParser.json());

    app.use('/api/v1/flows', flowRoute);
    app.use('/api/v1/teams', teamRoute);
    return app;
}