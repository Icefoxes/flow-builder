import express, { Express } from 'express';
import { flowRoute, nodeRoute, teamRoute } from './routes';
import cors from 'cors';
import BodyParser from 'body-parser';
import path from 'path';

export const createApp = () => {
    const app: Express = express();
    app.use(cors());
    console.log(path.join(__dirname, 'public'));
    app.use('/', express.static(path.join(__dirname, 'public')));
    app.use(express.static(path.join(__dirname, 'public')))
    app.use(BodyParser.urlencoded({ extended: false }));
    app.use(BodyParser.json());

    app.use('/api/v1/nodes', nodeRoute);
    app.use('/api/v1/flows', flowRoute);
    app.use('/api/v1/teams', teamRoute);

    return app;
}