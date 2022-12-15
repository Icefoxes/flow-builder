import express, { Request, Response } from 'express';
import { flowApi } from '../config';

const nodeRoute = express.Router();

nodeRoute.get('/search', (req: Request, res: Response) => {
    const q = req.query.q as string;
    if (q) {
        flowApi.searchNode(q).then(rlt => {
            res.json(rlt);
        })
    } else {
        res.status(404);
    }
});

export { nodeRoute }